import { Request, Response } from 'express';
import schoolModel from '../../models/schoolDB';
import getReschedules from '../../services/reschedule/getReschedules';
import { err, resp, unexpectedError } from '../../utils/formatResponse';
import getAssignedTeachersSummary from '../../services/reschedule/getAssignedTeachersSummary';

export default async function getPublicReschedulesHandler(req: Request, res: Response) {
	try {
		if (!req.params.username) return res.status(200).json(err('Username not found'));

		const school = await schoolModel.findOne({ username: req.params.username });
		if (!school) return res.status(200).json(err('School Not found'));

		school.apiAccess.requestsCount = school.apiAccess.requestsCount + 1;
		school.save();

		const response = await getReschedules(school?.attendanceCollection);
		const summary = await getAssignedTeachersSummary(school?.attendanceCollection, school?.teacherCollection);

		res.status(200).json(resp({ ...response, summary }));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
