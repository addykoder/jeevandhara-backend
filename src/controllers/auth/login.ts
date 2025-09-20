import { Request, Response } from 'express';
import login from '../../services/auth/login';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function loginHandler(req: Request, res: Response) {
	try {
		const { username, password } = req.body;
		if (!(username && password)) return res.status(200).json(err('username and password required'));
		const response = await login(username, password);
		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
