import { Request, Response } from 'express';
import signup from '../../services/auth/signup';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function signupHandler(req: Request, res: Response) {
	try {
		const { schoolName, username, adminPassword, password, phone, email, adminName } = req.body;

		// fetching the signup code from jsonBIN
		const bin = await fetch('https://api.jsonbin.io/v3/b/64c52590b89b1e2299c7e4b5', {
			headers: {
				'X-Master-Key': process.env.JSONBIN_MASTER_KEY || '$2b$10$RDYWcu6rvRGsxAsnRgi85uh1Yk4ZIyer/g0AqLTdK.gO3UOVaGGqO',
			},
		}).then(response => response.json());
		// token for signing up
		const signupCode = bin.record.code;

		if (!req.body.token || req.body.token != signupCode) return res.status(200).json(err('SignUp Not allowed'));
		const response = await signup(schoolName, username, adminPassword, password, adminName, phone, email);

		// changing the signup code
		fetch('https://api.jsonbin.io/v3/b/64c52590b89b1e2299c7e4b5', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				'X-Master-Key': '$2b$10$RDYWcu6rvRGsxAsnRgi85uh1Yk4ZIyer/g0AqLTdK.gO3UOVaGGqO',
			},
			body: JSON.stringify({ code: Math.floor(Math.random() * 100000) }),
		});

		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
