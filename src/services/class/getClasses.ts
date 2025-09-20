import schoolModel from '../../models/schoolDB';
import { resp, err, unexpectedError } from '../../utils/formatResponse';

export default async function getClasses(username: string) {
	try {
		const classes = await schoolModel.findOne({ username: username }, 'classes');
		if (!classes) return err('Invalid access token');
		return resp(classes);
	} catch (e) {
		return unexpectedError;
	}
}
