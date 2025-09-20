import { Request, Response } from 'express';
import signup from '../../services/auth/signup';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function signupHandler(req: Request, res: Response) {
	try {
		const { schoolName, username, adminPassword, password, phone, email, adminName } = req.body;

		const response = await signup(schoolName, username, adminPassword, password, adminName, phone, email);

		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
