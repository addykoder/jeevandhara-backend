import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { err, unexpectedError } from '../../utils/formatResponse';
import verifyLogin from '../../services/auth/verifyLogin';
dotenv.config();

export default async function verifyLoginHandler(req: Request, res: Response) {
	try {
		const token = req.body.token || req.query.token || req.headers['token'];
		if (!token) return res.status(200).json(err('No token found'));
		const response = await verifyLogin(token);
		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
