import schoolModel from '../../models/schoolDB';
import * as dotenv from 'dotenv';
import { compare, hash } from 'bcryptjs';
import { unexpectedError } from '../../utils/formatResponse';
import { err, msg } from '../../utils/formatResponse';
dotenv.config();

export default async function changePassword(username:string, currentAdminPassword:string, newAdminPassword:string, newPassword:string) {
	try {
		if (!(username && newPassword && currentAdminPassword && newAdminPassword)) return err('All Input required');

		// checking if user already exists
		const oldUser = await schoolModel.findOne({ username });
		if (!oldUser?.password || !oldUser?.adminPassword) return err('some server error')

		if(!await compare(currentAdminPassword, oldUser.adminPassword)) return err('Incorrect credentials')


		// verifying passwords
		if (newPassword.length < 8) return err('user password should be atleast 8 characters')
		if (newAdminPassword.length < 8) return err('admin password should be atleast 8 characters')


		const encryptedAdminPassword = await hash(newAdminPassword, 10);
		const encryptedPassword = await hash(newPassword, 10);
		
		oldUser.password = encryptedPassword
		oldUser.adminPassword = encryptedAdminPassword

		await oldUser.save()
		return msg('Password Updated successfully');
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}