import { schoolDatatype } from "./types";

export default async function postCreateTeacher(school: schoolDatatype, count: number) {
	const nextRollNumber = school.nextRollNumber;
	const subscription = school.subscription
	// incrementing the nextRollNumber
	school.nextRollNumber = nextRollNumber + 1;
	// if current teacher count > maxTeacher count
	if (count > subscription.maxTeachers) {
		// increment the maxTeachers
		school.subscription.maxTeachers = count
	}
	await Object(school).save()
}