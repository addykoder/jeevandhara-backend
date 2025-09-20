import getTeacher from './utils/getTeacher';
import getTeachersTodayTimetable from './utils/getTeachersTodayTimetable';
import isTeacherFree from './utils/isTeacherFree';
import { freeTeachersDatatype, reschedulesDatatype, schoolDatatype, teacherDatatype } from '../utils/types';
import { attendanceDatatype } from '../utils/types';
import getClass from './utils/getClass';
import shuffleArray from './utils/shuffleArray';
import { getHalveLimit, isInHalve } from './utils/halves';

// the function takes previousReschedules the period which are assigned before
// calling this function so that the priority of those teachers can be reduced
export default function getFreeTeachers(period: number, previousReschedules: reschedulesDatatype[], savedTeachers: teacherDatatype[], savedAttendance: attendanceDatatype[], school: schoolDatatype, day:number) {
	const attendance = savedAttendance;
	const reschedules = [...previousReschedules];
	const excludedClasses = school.preferences.excludedClasses;
	const excludedTeachers = school.preferences.excludedTeachers;
	const excludedPeriods = school.preferences.excludedPeriods
	const classes = school.classes;

	// calculation halves for split priority option
	const dayPeriods = day === 6 ? school.preferences.saturdayPeriod : school.preferences.weekdayPeriod;
	const halve = getHalveLimit(period, dayPeriods)
	// temporarily disabling this feature to test another one

	const setting = school.preferences.chunkPriorityHalves
	const timetableSlice = setting ==='strict'? halve: [0,dayPeriods+1]

	// console.log(timetableSlice);
	


	let freeTeachers: freeTeachersDatatype[] = [];
	// iterating over all teachers
	// iterating over shuffled teachers to randomize substitutions
	for (const { id } of shuffleArray(savedTeachers)) {
		// if teacher is excluded leave it and continue
		if (excludedTeachers.includes(id)) continue;
		// getting the teacher document
		const teacher = getTeacher(savedTeachers, id);
		if (teacher === null) continue;
		// getting today's timetable of the teacher
		const timeTable = [teacher.classTeacherOf, ...getTeachersTodayTimetable(teacher, day)];

		// if the concerned period of a teacher is free
		// or if the period is of any excluded class
		// and if he is not absent, then add it to the array
		if (isTeacherFree(period, id, timeTable, excludedClasses, attendance)) {
		// console.log(period);
		// console.log(teacher.name);
		// console.log(timeTable);
		// 	console.log(timeTable.slice(...timetableSlice));
		// 	console.log('priority' + `${timeTable.slice(...timetableSlice).filter((e, index) => (e !== 'free' && !excludedClasses.includes(e)) && !excludedPeriods.includes(index)).length * -10}`);
			
		
			freeTeachers.push({
				id: teacher.id,
				name: teacher.name,
				messagingPreference: teacher.messagingPreference,
				phone: teacher.phone,
				email:teacher.email,
				category: teacher.category,
				todayTimetable: timeTable,
				classesTeaching: teacher.classesTeaching,
				// if maxTeachingClass is . or if that classes does not exist in database returns infinity
				handlingLevel: teacher.maxTeachingClass !== '.' && getClass(classes, teacher.maxTeachingClass) ? getClass(classes, teacher.maxTeachingClass).handlingLevel: Infinity,
				// priority: timeTable.slice(0,periodLimit).filter((e, index) => (e !== 'free' && e!=='busy' && !excludedClasses.includes(e)) && !excludedPeriods.includes(index)).length * -10,
				// removed e!== busy to avoid more substitution if 'busy', currently it was considered as free
				priority: (timeTable.slice(...timetableSlice).filter((e, index) => (e !== 'free' && !excludedClasses.includes(e)) && !excludedPeriods.includes(index + timetableSlice[0]) && isInHalve(index + timetableSlice[0], halve)).length * (setting ==='moderate'? -15:-10) ) +
				(timeTable.slice(...timetableSlice).filter((e, index) => (e !== 'free' && !excludedClasses.includes(e)) && !excludedPeriods.includes(index+timetableSlice[0]) && !isInHalve(index+timetableSlice[0], halve)).length * -10 )	
				,
			});
		}
	}

	// reducing the priority of teachers which are already
	// assigned a reschedule
	for (const e of reschedules) {
		const teacherId = e.teacherId;
		// not reducing priority if period is of some other halve
		if (setting === 'strict' && !isInHalve(e.periodNo, halve)) continue;

		freeTeachers = freeTeachers.map(i => {
			if (i.id !== teacherId) return i;
			return { ...i, priority: i.priority - (setting === 'moderate' && isInHalve(e.periodNo, halve)?17:12 )};
		});
	}

	// sorting the freeTeachers array on priority
	freeTeachers.sort((a, b): number => {
		if (a.priority > b.priority) return -1;
		else if (a.priority < b.priority) return 1;
		return 0;
	});


	return freeTeachers

	// grouping teachers based on junior, senior or pgt
	// shape of object: {id, timetable, priority}
	// const concernedTeachers: { junior: freeTeachersDatatype[]; senior: freeTeachersDatatype[]; pgt: freeTeachersDatatype[] } = { junior: [], senior: [], pgt: [] };
	// for (const teacher of freeTeachers) {
	// 	Object(concernedTeachers)[Object(teacher).category].push(teacher);
	// }

	// return concernedTeachers;
}
