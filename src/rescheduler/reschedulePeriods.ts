import groupPeriodWise from './utils/groupPeriods';
import getFreeTeachers from './getFreeTeachers';
import { requestedRescheduleType, reschedulesDatatype, schoolDatatype, teacherDatatype } from '../utils/types';
import shuffleArray from './utils/shuffleArray';

export default function reschedulePeriods(periods: requestedRescheduleType[], savedTeachers: teacherDatatype[], savedAttendance: { id: number; presentPeriods: number[] }[], school: schoolDatatype, day:number, reschedules:reschedulesDatatype[] = []) {
	// grouping requestedReschedules period wise
	// so that it is easy to assign teacher with highest priority

	const groupedPeriods = groupPeriodWise(periods, school.classes);
	// the actual reschedule array
	// shape array of {for: teacherInPlace of, teacherName, teacherID, className, periodNo}
	//* const reschedules: reschedulesDatatype[] = []; // already defined in argument
	// Iterating over each period
	// shuffling the order of substituting periods for more randomness
	for (const periodNo of shuffleArray(Object.keys(groupedPeriods))) {
		
		if (groupedPeriods[periodNo].length === 0) continue;
		// reschedules are also passed to reduce priority of
		// already rescheduled teachers

		// after getting free teacher filtering the once already in a reschedule due to preserve argument
		const freeTeachers = getFreeTeachers(Number(periodNo), reschedules, savedTeachers, savedAttendance, school, day).filter(t => {
			for (const r of reschedules.filter(r => r.periodNo === Number(periodNo))) {
				if (t.id === r.teacherId) return false
			}
			return true
		});
		// console.log(`-------------- PERIOD: ${periodNo} ----------------`);
		
		// freeTeachers.map(t => console.log(`${(t.name+'        ').slice(0, 10)}  ${t.priority}`));
		// console.log('********************************');
		
		
		

		// now iterate over each reschedule in a period
		// assign teachers the reschedule and pop them out of array
		for (const requestedReschedule of groupedPeriods[periodNo]) {
			// now choosing the best teacher for this particular period
			let chosenIndex = -1;
			let reason = freeTeachers.length === 0 ? 'No free Teacher' : 'undefined reason';

			// first choice found a category + level compatible teacher: only if in preference
			for (const [index, teacher] of freeTeachers.entries()) {
				if (!school.preferences.restrictToCategory || teacher.category === requestedReschedule.classCategory) {
					if (!school.preferences.restrictToLevel || teacher.handlingLevel >= requestedReschedule.classLevel) {
						chosenIndex = index;
						reason = 'category + level'
						break;
					}
				}
			}
			// second choice found level compatible teacher
			if (chosenIndex === -1) {
				if (school.preferences.restrictToLevel) {
					for (const [index, teacher] of freeTeachers.entries()) {
						if (teacher.handlingLevel >= requestedReschedule.classLevel) {
							chosenIndex = index;
							reason = 'level'
							break;
						}
					}
				}
			}
			// third choice found category compatible with highest level
			// for now completely ignoring idleness and choosing the closest level
			let chosenLevel = -Infinity;
			if (chosenIndex === -1) {
				for (const [index, teacher] of freeTeachers.entries()) {
					if (!school.preferences.restrictToCategory || teacher.category === requestedReschedule.classCategory) {
						if (school.preferences.restrictToLevel) {
							if (teacher.handlingLevel > chosenLevel) {
								chosenIndex = index;
								reason = 'highest level in category'
								chosenLevel = teacher.handlingLevel;
							}

							// select the first teacher with compatible category if restrictToLevel option is disabled
						} else {
							chosenIndex = index;
							reason = 'idlest teacher in category'
							chosenLevel = teacher.handlingLevel;
							break;
						}
					}
				}
			}

			// fixed the case if category is not found and still chosen index = -1
			// will loop over teachers and keep track of highest level
			// if found will return a teacher with valid level else return the teacher with highest level
			chosenLevel = -Infinity
			if (chosenIndex === -1) {
				for (const [index, teacher] of freeTeachers.entries()) {
					if (teacher.handlingLevel > chosenLevel) {
						chosenLevel = teacher.handlingLevel
						reason = 'highest level of all'
						chosenIndex = index
					}
					if (!school.preferences.restrictToLevel || teacher.handlingLevel >= requestedReschedule.classLevel) {
						chosenIndex = index;
						reason = 'level'
						break;
					}
				}
			}

			// *** now a teacher must have been chosen if freeTeachers is not empty
			// now once again iterate over the array to see if any related teacher
			// is available near the selected priority : only if toogle to true in preferences
			if (school.preferences.allotRelatedTeacher) {
				const selectedPriority = chosenIndex !== -1 ? freeTeachers[chosenIndex].priority : 0;
				for (const [index, teacher] of freeTeachers.entries()) {
					if (teacher.classesTeaching.includes(requestedReschedule.className) && selectedPriority - teacher.priority <= 0) {
						chosenIndex = index;
						reason = 'regular teacher'
						break;
					}
				}
			}

			// safety check if teacher is still undefined
			// if so choose the first/idlest teacher
			if (chosenIndex === -1 && freeTeachers.length >= 1) {
				chosenIndex = 0
				reason = 'unexpected index 0'
			}

			// *** now got a teacher or chosenIndex is still undefined

			// if not found any teacher return undefined
			const teacherToPush = chosenIndex !== -1 ? freeTeachers.splice(chosenIndex, 1)[0] : undefined;

			reschedules.push({
				for: requestedReschedule.for,
				teacherId: teacherToPush?.id,
				teacherName: teacherToPush?.name,
				teacherPhone: teacherToPush?.phone,
				teacherEmail: teacherToPush?.email,
				className: requestedReschedule.className,
				periodNo: Number(periodNo),
				teacherMessagingPreference: teacherToPush?.messagingPreference,
				reason, 
				tags: ['auto']
			});
		}
	}
	// sorting the reschedules back as per periodNo coz above we have 
	// shuffled it to randomize substitutions
	reschedules.sort((a, b) => a.periodNo - b.periodNo)
	return reschedules
}
