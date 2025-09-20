import getTeacher from '../../services/teacher/getTeacher';
import { Response } from 'express';
import { customRequest } from '../../utils/types';
import { err, resp, unexpectedError } from '../../utils/formatResponse';

export default async function getTeacherHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		const id = Number(req.params.teacherID);
		if (!id) return res.status(200).json(err('id is required'));
		res.status(200).json(resp({ teacher: await getTeacher(id, req.teachers as string) }));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
