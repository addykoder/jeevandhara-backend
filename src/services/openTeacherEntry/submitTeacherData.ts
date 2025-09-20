import { err } from "../../utils/formatResponse";
import { classesType, verifyTeacherDatatype } from "../../utils/types";
// import isSubscribed from "../subscription/isSubscribed";
import createTeacher from "../teacher/createTeacher";
import getFullSchoolInfo from "./getFullSchoolInfo";

export default async function submitTeacherData(username:string, teacherData: verifyTeacherDatatype) {
	const response = await getFullSchoolInfo(username);

	if (!(response.status === 'ok')) return err('some error occurred');
	const school = response.payload;
	// checking if the subscription is valid
	// currently disabled subscription verification for open teacher entry
	// if (!isSubscribed(school)) return err('subscription expired');
	const teacherCollection = school.teacherCollection;

	// extracting submitted data
	const classes: classesType[] = school.classes;
	const { saturdayPeriod, weekdayPeriod } = school.preferences;
	const nextRollNumber = school.nextRollNumber;
	// verifying data
	const resp = await createTeacher(nextRollNumber, teacherData ,saturdayPeriod, weekdayPeriod, classes, teacherCollection);

	if (resp.status === 'ok') {
		// incrementing the nextRollNumber
		school.nextRollNumber = nextRollNumber + 1;
		// if current teacher count > maxTeacher count
		if (response.payload.count > school.subscription.maxTeachers) {
			// increment the maxTeachers
			school.subscription.maxTeachers = response.payload.count;
		}
		Object(school).save();
	}
	return resp;

}