import schoolModel from '../../models/schoolDB';
import { resp, err, unexpectedError } from '../../utils/formatResponse';

export default async function getPreference(username: string) {
	try {
		const preferences = await schoolModel.findOne({ username: username }, 'preferences');
		if (!preferences) return err('Invalid access token');
		return resp(preferences);
	} catch (e) {
		return unexpectedError;
	}
}
