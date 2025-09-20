import { Response } from 'express';
import { customRequest } from '../../utils/types';
import { err, unexpectedError } from '../../utils/formatResponse';
import renameClass from '../../services/class/renameClass';

export default async function renameClassHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		// checking for admin access
		if (!req.isAdmin) return res.status(200).json(err('admin access required to perform this operation'));
		// action not allowed in test account
		if (req.username === 'test') return res.status(200).json(err('Action not allowed in test account'));

		const username = req.username || '';
		const { prevName, newName } = req.body;

		if (!prevName || !newName) return res.status(200).json(err('classes are required'));
		renameClass(username, req.school.teacherCollection, prevName, newName, req.school.classes).then(r => res.status(200).json(r));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
