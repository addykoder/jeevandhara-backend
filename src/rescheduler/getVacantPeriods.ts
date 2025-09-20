import getTeacher from './utils/getTeacher';
import getTeachersTodayTimetable from './utils/getTeachersTodayTimetable';
import { attendanceDatatype, requestedRescheduleType, schoolDatatype, teacherDatatype } from '../utils/types';
import getClass from './utils/getClass';

// just a temporary fix for excluding these classes from
// rescheduling and teachers with regular period on these classes
// can be considered as free, effectively it means, that the
// class is not coming to school

export default function getVacantPeriods(savedTeachers: teacherDatatype[], savedAttendance: attendanceDatatype[], school: schoolDatatype, day:number) {
	// array of periods needed to be rescheduled
	// object {class, period} : In which period, Of which class
	const requestedReschedulePeriods: requestedRescheduleType[] = [];

	const excludedClasses = school.preferences.excludedClasses
	const excludedPeriods = school.preferences.excludedPeriods
	const attendance = savedAttendance;
	const classes = school.classes

	// fetching absent teachers' timetable
	const absentTeachersTimetable = attendance.map(teacherItem => {
		const teacher = getTeacher(savedTeachers, teacherItem.id);
		if (teacher === null) return;
		const todaysTimetable = getTeachersTodayTimetable(teacher, day);

		return {
			id: teacherItem.id,
			name: getTeacher(savedTeachers, teacherItem.id).name,
			classTeacherOf: teacher.classTeacherOf,
			timeTable: todaysTimetable,
			presentPeriods: teacherItem.presentPeriods,
		};
	});

	// iterating over absent teachers' timetable to add periods to request reschedule
	for (const teacher of absentTeachersTimetable) {
		if (!teacher) continue;
		const allPeriodsBeforeRemovingPresents = [teacher?.classTeacherOf, ...teacher.timeTable];
		// mapping over original periods and chaning the periods to free in which the teacher is present just so that it does not gets rescheduled
		const allPeriods = allPeriodsBeforeRemovingPresents.map((period: string, index: number) => {
			if (teacher.presentPeriods.includes(index)) return 'free';
			return period;
		});
		for (const [index, period] of allPeriods.entries()) {
			// The period should be rescheduled if it's not a free period,
			// neither a busy period and is of type string
			// and if it is not one of the excluded classes
			// and also if it is not an excluded period
			// and if it is a valid class
			if (period !== 'free' && period !== 'busy' && !excludedClasses.includes(period) && !excludedPeriods.includes(index) && getClass(classes, period)  && typeof period === 'string') {
				requestedReschedulePeriods.push({
					for: teacher.name,
					className: period,
					period: index,
					classCategory: getClass(classes, period).category,
					classLevel: getClass(classes, period).handlingLevel
				});
			}
		}
	}
	return requestedReschedulePeriods;
}
