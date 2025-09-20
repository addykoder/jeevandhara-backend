import { Response } from 'express';
import getSubscriptionHistory from '../../services/subscription/getSubscriptionHistory';
import { err, unexpectedError } from '../../utils/formatResponse';
import { customRequest } from '../../utils/types';

export default async function getSubscriptionHistoryHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		const resp = await getSubscriptionHistory(req.school);
		res.status(200).json(resp);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
