import { Response } from 'express';
import { customRequest } from '../../utils/types';
import { err, resp, unexpectedError } from '../../utils/formatResponse';
import regenerateReschedules from '../../services/reschedule/regenerateReschedules';

export default async function regenerateReschedulesHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		const response = resp(await regenerateReschedules(req.attendance as string, req.teachers as string, req.school));
		res.status(200).json(response);
		console.log('regenerate');
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
