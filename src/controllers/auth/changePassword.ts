import { Response } from 'express';
import { err, unexpectedError } from '../../utils/formatResponse';
import changePassword from '../../services/auth/changePassword';
import { customRequest } from '../../utils/types';

export default async function changePasswordHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		const username = req.username || '';
		// preventing from changing test account password
		if (username === 'test') return res.status(200).json(err('Action not allowed in test account'));
		const { currentAdminPassword, newAdminPassword, newPassword } = req.body;

		const response = await changePassword(username, currentAdminPassword, newAdminPassword, newPassword);

		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
