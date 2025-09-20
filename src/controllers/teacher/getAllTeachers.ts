import getAllTeachers from '../../services/teacher/getAllTeachers';
import { Response } from 'express';
import { customRequest } from '../../utils/types';
import { err, unexpectedError } from '../../utils/formatResponse';
import { resp } from '../../utils/formatResponse';

export default async function getAllTeachersHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		res.status(200).json(resp({ teachers: await getAllTeachers(req.teachers as string) }));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
