import attendanceModelConstructor from '../../models/attendanceDB';
import getTeacher from '../../rescheduler/utils/getTeacher';
import getTeachersTodayTimetable from '../../rescheduler/utils/getTeachersTodayTimetable';
import { unexpectedError } from '../../utils/formatResponse';
import { reschedulesDatatype, teacherDatatype } from '../../utils/types';
import getAllTeachersPower from '../teacher/getAllTeachersPower';

export default async function getAssignedTeachersSummary(attendanceCollection: string, teacherCollection: string, includeAll = false, includeSubstitutions = true, date=new Date().toISOString().slice(0, 10)) {
	try {
		const attendance = attendanceModelConstructor(attendanceCollection);
		const attendanceObject = await attendance.findOne({ date:date  }, '-_id').exec();
		if (!attendanceObject) return [];

		const reschedules: reschedulesDatatype[] = attendanceObject.reschedules;
		const day: number = attendanceObject.day;

		let groupedReschedules: { teacherId: number; teacherName: string; timeTable: { periodNo: number; period: string; tags: string[] }[] }[] = [];

		// only if substitution to be included, otherwise leave it empty
		if (includeSubstitutions) {
			for (const reschedule of reschedules) {
				if (groupedReschedules.map(s => s.teacherId).includes(reschedule.teacherId as number)) {
					groupedReschedules = groupedReschedules.map(s => {
						if (s.teacherId === reschedule.teacherId)
							return {
								...s,
								timeTable: [...s.timeTable, { periodNo: reschedule.periodNo, period: reschedule.className, tags: [...(reschedule.tags as string[]), 'reschedule'] }],
							};

						return s;
					});
				} else {
					groupedReschedules.push({
						teacherId: reschedule.teacherId as number,
						teacherName: reschedule.teacherName as string,
						timeTable: [{ periodNo: reschedule.periodNo as number, period: reschedule.className as string, tags: [...(reschedule.tags as string[]), 'reschedule'] }],
					});
				}
			}
		}

		const summary: { teacherId: number; teacherName: string; timeTable: { period: string; tags: string[] }[] }[] = [];

		const teachers = (await getAllTeachersPower(teacherCollection)) as teacherDatatype[];

		for (const t of groupedReschedules) {
			if (!getTeacher(teachers, t.teacherId)) continue
			const timeTable = getTeachersTodayTimetable(getTeacher(teachers, t.teacherId), day).map(p => ({ period: p, tags: ['regular'] }));

			for (const p of t.timeTable) {
				timeTable[p.periodNo - 1] = { period: p.period, tags: p.tags };
			}

			summary.push({ teacherId: t.teacherId, teacherName: t.teacherName, timeTable: timeTable });
		}

		if (includeAll) {
			for (const teacher of teachers) {
				if (!summary.map(s => s.teacherId).includes(teacher.id)) {
					const periodsPresent = attendanceObject.attendance.filter(a => a.id === teacher.id)[0] ? attendanceObject.attendance.filter(a => a.id === teacher.id)[0].presentPeriods : 'all'
					
					// not pushing teacher if not present for any period
					if (periodsPresent.length === 0) continue
					summary.push({
						teacherId: teacher.id,
						teacherName: teacher.name,
						timeTable: getTeachersTodayTimetable(teacher, day).map((p,index) => ({ period: p==='free'?(periodsPresent==='all'?p:periodsPresent.includes(index+1)?p:'abs'):p, tags: ['regular'] })),
					});
				}
			}
		}

		return summary;
	} catch (e) {
		console.log(e);
		return { ...unexpectedError, reschedules: null };
	}
}
