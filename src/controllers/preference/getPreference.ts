import { Response } from 'express';
import { customRequest } from '../../utils/types';
import getPreferences from '../../services/preference/getPreference';
import { err, unexpectedError } from '../../utils/formatResponse';

export default async function getPreferenceHandler(req: customRequest, res: Response) {
	try {
		if (!req.school) return res.status(200).json(err('invalid token'));
		const username = req.username || '';
		const preferences = await getPreferences(username);
		res.status(200).json(preferences);
	} catch (e) {
		console.log(e);
		res.status(200).json(unexpectedError);
	}
}
