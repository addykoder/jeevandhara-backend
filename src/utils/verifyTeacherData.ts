import { teacherCategory, teacherTimetable, classType, classesType } from './types';

export default function verifyTeacherData(
	{name, category,timeTable, classTeacherOf, maxTeachingClass, phone, email, messagingPreference }:{
		name: string,
		category: teacherCategory,
		timeTable: teacherTimetable,
		classTeacherOf: classType,
		maxTeachingClass: string,
		phone?: number,
		email?: string,
		messagingPreference: string
	},
	saturdayPeriod: number,
	weekdayPeriod: number,
	classes: classesType[]
) {
	const classesNames = classes.map(c => c.name);
	// verifying inputs
	if (!(name && category && timeTable && messagingPreference && maxTeachingClass)) return 'incomplete data'
	// maxTeachingClass : if from one of the classes or '.' means can teach all classes
	if (!classesNames.includes(maxTeachingClass) && maxTeachingClass !== '.') return 'invalid maxTeachingClass';
	//preference
	if (messagingPreference && !['whatsapp', 'email', 'sms', 'none'].includes(messagingPreference)) return 'invalid preference';
	// phone
	if (phone && (phone < 1000000000 || phone > 9999999999)) return 'invalid phone no.';
	// email
	if (email && (!email.includes('@') || email.includes(' '))) return 'invalid gmail address';
	// Category
	if (!['subjunior', 'junior', 'senior', 'pgt'].includes(category)) return `invalid category ${category}`;

	// TimeTable
	// ----- No of days
	if (!timeTable) return 'timetable not found';
	if (Object.values(timeTable).length !== 6) return 'not valid days in timeTable';
	for (const day of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']) {
		if (!(day in timeTable)) return `invalid day in timetable : ${day} not present`;
	}
	// ----- Valid periods
	for (const day of ['mon', 'tue', 'wed', 'thu', 'fri']) {
		if (timeTable[day].length !== weekdayPeriod) return 'invalid number of periods';
	}
	if (timeTable.sat.length !== saturdayPeriod) return 'invalid number of saturday periods';

	for (const day of Object.values(timeTable)) {
		for (const period of [...day, classTeacherOf]) {
			// case if classTeacherOf is undefined
			if (period === undefined) return 'classTeacherOf not defined';
			// A period can also be free
			// Period can also be busy so to avoid it from
			// being rescheduled
			if (period === 'free' || period === 'busy') continue;
			// if period is of a valid class

			if (classesNames.includes(period)) continue;
			else {
				return `invalid class ${period}, not found in school database`;
			}
		}
	}

	return true;
}
