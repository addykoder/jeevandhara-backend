import schoolModel from '../../models/schoolDB';
import * as dotenv from 'dotenv';
import { hash } from 'bcryptjs';
import { unexpectedError } from '../../utils/formatResponse';
import { err, msg } from '../../utils/formatResponse';
import verifySchoolData from '../../utils/verifySchoolData';
dotenv.config();

export default async function signup(schoolName: string, username: string, adminPassword: string, password: string, adminName: string, phone: number, email: string) {
	try {
		if (!(schoolName && username && password && adminName && phone && email)) return err('All Input required');

		if (verifySchoolData(username, adminPassword, password, phone, email) !== true) return verifySchoolData(username, adminPassword, password, phone, email);
		// checking if user already exists
		const oldUser = await schoolModel.findOne({ username });
		if (oldUser) return err(`user already exists with username '${username}'`);

		// hashing the password
		const encryptedAdminPassword = await hash(adminPassword, 10);
		const encryptedPassword = await hash(password, 10);

		// creating school object
		const school = new schoolModel({
			schoolName,
			adminName,
			phone,
			email,
			username,
			adminPassword: encryptedAdminPassword,
			password: encryptedPassword,
			teacherCollection: `${username}_teacher`,
			attendanceCollection: `${username}_attendance`,
			// defaulting other required fields
			apiAccess: {
				requestsCount: 0,
			},
			preferences: {
				excludedClasses: [],
				excludedTeachers: [],
				excludedPeriods: [],
				restrictToCategory: false,
				restrictToLevel: false,
				allotRelatedTeacher: true,
				teacherModificationAllowed: false,
				weekdayPeriod: 8,
				saturdayPeriod: 6,
				enableMessaging: false,
				chunkPriorityHalves: 'no',
			},
			subscription: { expiresOn: [new Date()] },
			payments: [],
		});

		await school.save();
		return msg('Registered Successfully');
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
