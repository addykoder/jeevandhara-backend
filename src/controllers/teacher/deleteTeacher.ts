import deleteTeacher from '../../services/teacher/deleteTeacher';
import { Response } from 'express';
import { customRequest } from '../../utils/types';
import { err, unexpectedError } from '../../utils/formatResponse';
import { msg } from '../../utils/formatResponse';

export default async function deleteTeacherHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		// checking for admin access
		if (!req.isAdmin) return res.status(200).json(err('admin access required to perform this operation'));
		// action not allowed in test account
		if (req.username === 'test') return res.status(200).json(err('Action not allowed in test account'));

		const id = Number(req.params.teacherID);
		if (!id) return res.status(200).json(err('invalid id passed'));
		await deleteTeacher(id, req.teachers as string);
		res.status(200).json(msg(`Teacher with id ${id} deleted successfully`));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
