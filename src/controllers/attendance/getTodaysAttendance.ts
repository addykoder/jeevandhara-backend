import { Response } from 'express';
import { customRequest } from '../../utils/types';
import { err, unexpectedError } from '../../utils/formatResponse';
import { resp } from '../../utils/formatResponse';
import getTodaysAttendance from '../../services/attendance/getTodaysAttendance';

export default async function getTodaysAttendanceHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));

		const attendance = await getTodaysAttendance(req.attendance as string);

		res.status(200).json(resp({ attendance }));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
