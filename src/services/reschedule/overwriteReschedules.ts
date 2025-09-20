import attendanceModelConstructor from "../../models/attendanceDB";
import { reschedulesDatatype } from "../../utils/types";

export default async function overwriteReschedules(attendanceCollection: string, reschedules: reschedulesDatatype[]) {

	const attendance = attendanceModelConstructor(attendanceCollection);
	const attendanceObject = await attendance.findOne({ date: new Date().toISOString().slice(0, 10) }).exec();
	if (!attendanceObject) return 'attendance not found'

	await attendance.findOneAndUpdate({ date: new Date().toISOString().slice(0, 10) }, {
		reschedules: attendanceObject.reschedules.map(r => {
			for (const newResc of reschedules) {
				if (r.periodNo === newResc.periodNo && r.className === newResc.className && r.for === newResc.for) return { ...newResc, tags:['manual'] }; 
			}
			return r
	})})

	return 'Updated'
}