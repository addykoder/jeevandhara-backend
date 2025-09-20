import { Response } from 'express';
import { customRequest } from '../../utils/types';
import updatePreference from '../../services/preference/updatePreference';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function updatePreferencesHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		// checking for admin access
		if (!req.isAdmin) return res.status(200).json(err('admin access required to perform this operation'));

		const preferences = req.body?.preference || {};
		if (!preferences) return res.status(200).json('preferences are required');
		const username = req.username || '';
		updatePreference(preferences, username, req.school.teacherCollection, req.school.preferences.weekdayPeriod, req.school.preferences.saturdayPeriod).then(r => res.status(200).json(r));
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
