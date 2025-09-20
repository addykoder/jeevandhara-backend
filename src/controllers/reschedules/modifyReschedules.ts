import { Response } from 'express';
import { customRequest, reschedulesDatatype } from '../../utils/types';
import { err, unexpectedError } from '../../utils/formatResponse';
import overwriteReschedules from '../../services/reschedule/overwriteReschedules';

export default async function modifyReschedulesHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));

		const reschedules: reschedulesDatatype[] = req.body.reschedules
		const msg = await overwriteReschedules(req.school.attendanceCollection, reschedules)
		res.status(200).json(msg)

	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
