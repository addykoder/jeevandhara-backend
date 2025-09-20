import teacherModelConstructor from '../../models/teacherDB';

// returns list of all teachers included with timetables
export default async function getAllTeachersPower(teacherCollection: string) {
	try {
		const teacher = teacherModelConstructor(teacherCollection);
		return await teacher.find({}, '-_id -__v -password').exec();
	} catch (e) {
		console.log(e);
	}
}
