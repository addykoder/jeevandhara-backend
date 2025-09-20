import teacherModelConstructor from '../../models/teacherDB';
import { classesType, verifyTeacherDatatype } from '../../utils/types';
import { err, unexpectedError } from '../../utils/formatResponse';
import { msg } from '../../utils/formatResponse';
import verifyTeacherData from '../../utils/verifyTeacherData';

export default async function updateTeacher(id: number, teacherData: verifyTeacherDatatype, saturdayPeriod: number, weekdayPeriod:number, classes: classesType[], teacherCollection: string) {
	try {
		if (verifyTeacherData(teacherData, saturdayPeriod, weekdayPeriod, classes) !== true) return err(verifyTeacherData(teacherData, saturdayPeriod, weekdayPeriod, classes) as string)
		// extracting classes out of teacher timetable
		const classesTeaching: string[] = teacherData.classTeacherOf === 'free'?[]:[teacherData.classTeacherOf];
		for (const day of Object.values(teacherData.timeTable)) {
			for (const period of day) {
				if (!classesTeaching.includes(period) && !['free', 'busy'].includes(period)) classesTeaching.push(period);
			}
		}

		const teacher = teacherModelConstructor(teacherCollection);
		return teacher
			.findOneAndUpdate(
				{ id },
				{
					id,
					...teacherData,
					classesTeaching,
				}
			)
			.then(() => msg(`Teacher with id ${id} updated successfully`));
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
