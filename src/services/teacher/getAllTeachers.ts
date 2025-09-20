import teacherModelConstructor from '../../models/teacherDB';
import { unexpectedError } from '../../utils/formatResponse';

export default async function getAllTeachers(teacherCollection: string) {
	try {
		const teacher = teacherModelConstructor(teacherCollection);
		return await teacher.find({}, '-id id name category classTeacherOf').exec();
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
