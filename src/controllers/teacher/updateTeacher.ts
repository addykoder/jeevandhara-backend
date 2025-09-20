import updateTeacher from '../../services/teacher/updateTeacher';
import { Response } from 'express';
import { classesType, customRequest } from '../../utils/types';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function updateTeacherHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		// checking for admin access
		if (!req.isAdmin) return res.status(200).json(err('admin access required to perform this operation'));
		// action not allowed in test account
		if (req.username === 'test') return res.status(200).json(err('Action not allowed in test account'));

		const classes: classesType[] = req.school.classes;
		const { saturdayPeriod, weekdayPeriod } = req.school.preferences;
		const id = Number(req.params.teacherID);
		if (!id) return res.status(200).json(err('invalid id passed'));
		const { name, category, timeTable, classTeacherOf } = req.body;
		// extracting separately to avoid undefined error
		const maxTeachingClass = req.body.maxTeachingClass || '.';
		const phone = req.body.phone;
		const email = req.body.email;
		const messagingPreference = req.body.messagingPreference || 'none';

		const resp = await updateTeacher(
			id,
			{ name, category, timeTable, classTeacherOf, maxTeachingClass, phone, email, messagingPreference },
			saturdayPeriod,
			weekdayPeriod,
			classes,
			req.teachers as string
		);

		res.status(200).json(resp);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
