import teacherModelConstructor from '../../models/teacherDB';
import { classesType, verifyTeacherDatatype } from '../../utils/types';
import { err, resp, unexpectedError } from '../../utils/formatResponse';
import verifyTeacherData from '../../utils/verifyTeacherData';

export default async function createTeacher(nextRollNumber: number, teacherData: verifyTeacherDatatype,saturdayPeriod: number, weekdayPeriod: number, classes: classesType[], teacherCollection: string) {
	try {
		// verifying teacher Data here
		if (verifyTeacherData(teacherData, saturdayPeriod, weekdayPeriod, classes) !== true) return err(verifyTeacherData(teacherData, saturdayPeriod, weekdayPeriod, classes) as string)
		// extracting classes out of teacher timetable
		const classesTeaching: string[] = teacherData.classTeacherOf === 'free'?[]:[teacherData.classTeacherOf];
		for (const day of Object.values(teacherData.timeTable)) {
			for (const period of day) {
				if (!classesTeaching.includes(period) && !['free', 'busy'].includes(period)) classesTeaching.push(period);
			}
		}

		const teacher = teacherModelConstructor(teacherCollection);
		const newTeacher = new teacher({
			// automatically adds unique id
			// not Included in teacherData
			id: nextRollNumber,
			classesTeaching,
			...teacherData,
		});
		return await newTeacher
			.save()
			.then(async () => resp({ message: `Teacher created with id ${nextRollNumber}`, count: await teacher.countDocuments()}))
			.catch(err => {
				console.log(err);
				return err('some error occured while creating teacher');
			});
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
