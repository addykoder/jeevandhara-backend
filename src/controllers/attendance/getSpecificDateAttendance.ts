import { Response } from 'express';
import getSpecificDateAttendance from '../../services/attendance/getSpecificDateAttendance';
import { err, unexpectedError } from '../../utils/formatResponse';
import { customRequest } from '../../utils/types';

export default async function getSpecificDateAttendanceHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		if (!req.params.date) return res.status(200).json(err('date required'));
		const response = await getSpecificDateAttendance(req.params.date, req.school.attendanceCollection, req.school.teacherCollection);
		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
