import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import schoolModel from '../../models/schoolDB';
import { err, resp, unexpectedError } from '../../utils/formatResponse';
dotenv.config();

export default async function verifyLogin(token: string) {
	try {
		const decoded = Object(verify(token, process.env.TOKEN_KEY as string));
		if (!decoded) return err('invalid access token');
		const school = await schoolModel.findOne({ username: decoded.username }, '-_id username schoolName adminName phone email subscription');
		const schoolVerify = await schoolModel.findOne({ username: decoded.username }, '-_id password adminPassword');


		if (!school || !schoolVerify?.password || !schoolVerify?.adminPassword) return err('Invalid access token');
		if(schoolVerify.password !== decoded.password || schoolVerify.adminPassword !== decoded.adminPassword) return err('Token verification updated')

		return resp({ school, isAdmin:decoded.isAdmin});

	} catch (e) {
		// the following error can occur when token is expired
		if (Object(e).name === 'TokenExpiredError') return err('token expired');
		return unexpectedError;
	}
}
