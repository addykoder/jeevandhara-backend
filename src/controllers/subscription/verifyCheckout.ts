import { Response } from 'express';
import { err, unexpectedError } from '../../utils/formatResponse';
import { customRequest } from '../../utils/types';
import verifyCheckout from '../../services/subscription/verifyCheckout';

export default async function verifyCheckoutHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));

		const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
		const resp = verifyCheckout(orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, process.env.PAY_ID || '', process.env.PAY_SECRET || '', req.username || '');
		res.status(200).json(resp);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
