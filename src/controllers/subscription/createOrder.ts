import { Response } from 'express';
import createOrder from '../../services/subscription/createOrder';
import { err, unexpectedError } from '../../utils/formatResponse';
import { customRequest } from '../../utils/types';

export default async function createOrderHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		// action not allowed in test account
		if (req.username === 'test') return res.status(200).json(err('Action not allowed in test account'));

		const orderType = req.body.type;
		if (!process.env.PAY_ID || !process.env.PAY_SECRET) return res.status(200).json(err('Server failed to process request'));

		const order = await createOrder(req.username || '', orderType, process.env.PAY_ID, process.env.PAY_SECRET);
		res.status(200).json(order);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
