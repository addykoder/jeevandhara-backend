import createTeacher from '../../services/teacher/createTeacher';
import { Response } from 'express';
import { classesType, customRequest } from '../../utils/types';
import { err, unexpectedError } from '../../utils/formatResponse';
import postCreateTeacher from '../../utils/incrementNextRollNumber';

export default async function createTeacherHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		// checking for admin access
		if (!req.isAdmin) return res.status(200).json(err('admin access required to perform this operation'));
		// action not allowed in test account
		if (req.username === 'test') return res.status(200).json(err('Action not allowed in test account'));

		const classes: classesType[] = req.school.classes;
		const { saturdayPeriod, weekdayPeriod } = req.school.preferences;
		const { name, category, timeTable, classTeacherOf } = req.body;
		// extracting separately to avoid undefined error
		const maxTeachingClass = req.body.maxTeachingClass || '.';
		const phone = req.body.phone;
		const email = req.body.email;
		const messagingPreference = req.body.messagingPreference || 'none';
		const nextRollNumber = req.school.nextRollNumber;
		const password = req.body.password;
		if (!password) return res.status(200).json(err('password required'));

		const response = await createTeacher(
			nextRollNumber,
			{ name, category, timeTable, classTeacherOf, maxTeachingClass, phone, email, messagingPreference, password },
			saturdayPeriod,
			weekdayPeriod,
			classes,
			req.teachers as string
		);

		if (response.status === 'ok') await postCreateTeacher(req.school, response.payload.count);

		res.status(200).json(response);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
