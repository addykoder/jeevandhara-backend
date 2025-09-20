import attendanceModelConstructor from '../../models/attendanceDB';
import { unexpectedError } from '../../utils/formatResponse';
import { attPrefDatatype, attendanceDatatype } from '../../utils/types';

export default async function updateTodaysAttendance(attendance: attendanceDatatype[],day:number, preferences:attPrefDatatype , attendanceCollection: string, preserve:boolean, preserveTill: number) {
	try {
		const attendanceModel = attendanceModelConstructor(attendanceCollection);

		await attendanceModel.findOneAndUpdate(
			{ date: new Date().toISOString().slice(0, 10) },
			{
				date: new Date().toISOString().slice(0, 10),
				attendance,
				notified:[],
				preferences,
				day,
				preserve, 
				preserveTill
			}
		);
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
