import { Response } from 'express';
import { customRequest } from '../../utils/types';
import getClasses from '../../services/class/getClasses';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function getClassesHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		const username = req.username || '';
		const classes = await getClasses(username);
		res.status(200).json(classes);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
