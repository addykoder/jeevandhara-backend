import attendanceModelConstructor from '../../models/attendanceDB';
import { attendanceDatatype } from '../../utils/types';

export default async function getTodaysAttendance(attendanceCollection: string) {
	try {
		const attendanceModel = attendanceModelConstructor(attendanceCollection);
		const attendanceObject  = await attendanceModel.findOne({ date: new Date().toISOString().slice(0, 10) }, 'attendance -_id').exec();
		if (!attendanceObject) return null
		const attendance: attendanceDatatype[] = attendanceObject?.attendance

		if (attendanceObject === undefined) return null;
		if (Object.keys(attendanceObject).length === 0) return null;

		return attendance;
	} catch (e) {
		console.log(e);
	}
}
