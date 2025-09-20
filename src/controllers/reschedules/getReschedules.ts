import { Response } from 'express';
import getReschedules from '../../services/reschedule/getReschedules';
import { err, resp, unexpectedError } from '../../utils/formatResponse';
import { customRequest } from '../../utils/types';

export default async function getPublicReschedulesHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));

		const response = resp(await getReschedules(req.attendance as string));
		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
