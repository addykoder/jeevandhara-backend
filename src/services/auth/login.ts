import schoolModel from '../../models/schoolDB';
import * as dotenv from 'dotenv';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { err, resp } from '../../utils/formatResponse';
dotenv.config();

export default async function login(username: string, password: string) {
	try {
		if (!(username && password)) return err('all input is required');
		// fetching required school object
		const school = await schoolModel.findOne({ username }) ;
		// if school entry is present
		if (!school) return err('invalid credentials')

		// if admin password matches
		if (Object.keys(school).length !== 0 && (await compare(password, school.adminPassword))) {
			// create new login token and return it to the user
			const token = sign({ username, isAdmin:true, adminPassword:school.adminPassword, password:school.password }, process.env.TOKEN_KEY as string, {
				expiresIn: '30d',
			});
			return resp({ token, as:'admin' });
		} 

		// if password matches
		if (Object.keys(school).length !== 0 && (await compare(password, school.password))) {
			// create new login token and return it to the user
			const token = sign({ username, isAdmin:false, adminPassword:school.adminPassword, password:school.password }, process.env.TOKEN_KEY as string, {
				expiresIn: '30d',
			});
			return resp({ token, as:'user' });
		} 
		
		return err('invalid credentials');
		
	} catch (e) {
		console.log(e);
	}
}
