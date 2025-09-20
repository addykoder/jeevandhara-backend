import { Request, Response } from 'express';
import getSchoolInfo from '../../services/openTeacherEntry/getSchoolInfo';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function getSchoolInfoHandler(req: Request, res: Response) {
	try {
		if (!req.body.username) return res.status(200).json(err('school username required'));
		const username = req.body.username;
		const response = await getSchoolInfo(username);
		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
