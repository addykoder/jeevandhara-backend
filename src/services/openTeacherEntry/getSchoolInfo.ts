import schoolModel from "../../models/schoolDB";
import { err, resp, unexpectedError } from "../../utils/formatResponse";
// import isSubscribed from "../subscription/isSubscribed";

export default async function getSchoolInfo(username: string) {
	try {
		const school = await schoolModel.findOne({username}, '-_id username schoolName messagingSubscribed preferences.saturdayPeriod preferences.weekdayPeriod preferences.teacherModificationAllowed classes renewals')
		if (school) {
			if (!school.preferences.teacherModificationAllowed) return err('Entry Portal closed by the Admin')
			// currently disabled subscription verification for open teacher entry
			// if (!isSubscribed(school)) return err('subscription expired')
			return resp(school)
		}
		return err('school not found')
	}
	catch (e) {
		console.log(e);
		return unexpectedError	
	}
}