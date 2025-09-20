import schoolModel from "../../models/schoolDB";
import { err, resp, unexpectedError } from "../../utils/formatResponse";

export default async function getFullSchoolInfo(username: string) {
	try {
		const school = await schoolModel.findOne({username})
		if (school) {
			if (school.preferences.teacherModificationAllowed) return resp(school)
			return err('modification not allowed')
		}
		return err('school not found')
	}
	catch (e) {
		console.log(e);
		return unexpectedError	
	}
}