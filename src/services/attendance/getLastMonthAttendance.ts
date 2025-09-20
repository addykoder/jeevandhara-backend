import attendanceModelConstructor from '../../models/attendanceDB';
import { resp, unexpectedError } from '../../utils/formatResponse';

export default async function getLastMonthAttendance(attendanceCollection: string) {
	try {
		const attendance = attendanceModelConstructor(attendanceCollection);
		const currentDate = new Date();
		// moving to last month date
		currentDate.setDate(currentDate.getDate() - 28);
		const requiredDate = new Date(currentDate.toISOString().slice(0, 10));
		
		const requiredAttendance = await attendance.find({ date: { $gte: requiredDate } });
		return resp(requiredAttendance)
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
