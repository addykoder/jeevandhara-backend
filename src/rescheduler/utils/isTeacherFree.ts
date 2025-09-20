export default function isTeacherFree(period: number, teacherId: number, todaysTimetable: string[], excludedClasses: string[], attendance: { id: number; presentPeriods: number[] }[]) {
	// if period is of a excluded class
	const isExcludedClassPeriod = excludedClasses.includes(todaysTimetable[period]);

	// if period is free
	const isFreePeriod = todaysTimetable[period] === 'free';

	// if teacher is present in that period
	let isNotAbsent = true;
	for (const r of attendance) {
		if (r.id === teacherId) {
			if (!r.presentPeriods.includes(period)) isNotAbsent = false;
		}
	}

	return (isFreePeriod || isExcludedClassPeriod) && isNotAbsent;
}
