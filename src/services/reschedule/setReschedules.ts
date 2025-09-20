import attendanceModelConstructor from '../../models/attendanceDB';
import { unexpectedError } from '../../utils/formatResponse';

export default async function setReschedules(reschedules: object[], attendanceCollection: string) {
	try {
		const attendance = attendanceModelConstructor(attendanceCollection);
		await attendance
			.findOneAndUpdate(
				{ date: new Date().toISOString().slice(0, 10) },
				{
					reschedules,
				}
			)
			.catch(r => {
				console.log('Some error occured' + String(r));
			});
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
