import teacherModelConstructor from '../../models/teacherDB';
import { unexpectedError } from '../../utils/formatResponse';

export default async function getTeacher(id: number, teacherCollection: string) {
	try {
		const teacher = teacherModelConstructor(teacherCollection);
		return await teacher.findOne({ id: id }, '-_id -password').exec();
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
