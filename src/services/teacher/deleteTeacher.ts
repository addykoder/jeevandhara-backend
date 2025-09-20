import teacherModelConstructor from '../../models/teacherDB';
import { unexpectedError } from '../../utils/formatResponse';

export default async function deleteTeacher(id: number, teacherCollection: string) {
	try {
		const teacher = teacherModelConstructor(teacherCollection);
		return teacher.deleteOne({ id }).then(() => `Teacher with id ${id} deleted successfully`);
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
