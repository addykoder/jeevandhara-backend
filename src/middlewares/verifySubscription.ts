import { err, unexpectedError } from '../utils/formatResponse';
import { customRequest } from '../utils/types';
import { Response } from 'express';
import { NextFunction } from 'express';
import isSubscribed from '../services/subscription/isSubscribed';

export default async function verifySubscription(req: customRequest, res: Response, next: NextFunction) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		// checking if the school subscript is active
		if (!isSubscribed(req.school)) return res.status(200).json(err('subscription expired'));
		next();
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
