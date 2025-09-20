// A copy of getTeacher function in teachersCRUD.ts
// instead of querying database it returns teacher
// from passed teachers list
import { teacherDatatype } from '../../utils/types';

export default function getTeacher(teachers: teacherDatatype[], id: number) {
	return teachers.filter(teacher => teacher.id === id)[0];
}
