import { Response } from 'express';
import { customRequest } from '../../utils/types';
import updateClasses from '../../services/class/updateClasses';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function updateClassesHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		// checking for admin access
		if (!req.isAdmin) return res.status(200).json(err('admin access required to perform this operation'));
		// action not allowed in test account
		if (req.username === 'test') return res.status(200).json(err('Action not allowed in test account'));

		const username = req.username || '';
		const classes = req.body.classes;
		if (!classes) return res.status(200).json(err('classes are required'));
		updateClasses(classes, username, req.school.teacherCollection).then(r => res.status(200).json(r));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
