import { Response } from 'express';
import { err, resp, unexpectedError } from '../../utils/formatResponse';
import { customRequest } from '../../utils/types';
import getAssignedTeachersSummary from '../../services/reschedule/getAssignedTeachersSummary';

export default async function getTeacherSummaryHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		const includeSubstitutions = req.body.includeSubstitutions === undefined? true : req.body.includeSubstitutions

		const response = resp(await getAssignedTeachersSummary(req.school.attendanceCollection, req.school.teacherCollection, true, includeSubstitutions));
		
		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
