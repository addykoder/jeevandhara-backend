import { Response } from 'express';
import { customRequest } from '../../utils/types';
import getReschedules from '../../services/reschedule/getReschedules';
import { err, resp, unexpectedError } from '../../utils/formatResponse';
import notifyTeachers from '../../services/notify/notifyTeachers';

export default async function uploadReschedulesHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		if (!req.school.preferences.enableMessaging) return res.status(200).json(err('messaging not enabled'));
		const response = resp(await getReschedules(req.attendance as string));
		if (response.payload.reschedules == null) return unexpectedError;
		const respMsg = await notifyTeachers(req.school, response.payload.reschedules);
		res.status(200).json(respMsg);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
