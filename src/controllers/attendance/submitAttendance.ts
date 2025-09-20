import { Response } from 'express';
import { customRequest } from '../../utils/types';
import submitAttendance from '../../services/attendance/submitAttendance';
import { unexpectedError } from '../../utils/formatResponse';
import { msg } from '../../utils/formatResponse';
import { err } from '../../utils/formatResponse';

export default async function submitAttendanceHandler(req: customRequest, res: Response) {
	try {
		const school = req.school;
		if (!school) return res.status(200).json(err('invalid token'));

		const day = req.body.day && [0, 1, 2, 3, 4, 5, 6].includes(Math.floor(req.body.day as number)) ? req.body.day : new Date().getDay();
		const response = await submitAttendance(req.body.attendance, req.attendance as string, req.teachers as string, school, day, req.body.preserve, req.body.preserveTill);
		res.status(200).json(msg(response));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
