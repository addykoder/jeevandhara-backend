import { Response } from 'express';
import getLastMonthAttendance from '../../services/attendance/getLastMonthAttendance';
import { err, unexpectedError } from '../../utils/formatResponse';
import { customRequest } from '../../utils/types';

export default async function getLastMonthAttendanceHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		const response = await getLastMonthAttendance(req.school.attendanceCollection);
		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
