import { err } from "./formatResponse";

export default function verifySchoolData(username: string, adminPassword:string, password: string, phone: number, email: string) {
	// checking username
	if (username.includes(' ')) return err('username cannot contain spaces')
	if (username.length > 8) return err('username can be of max 8 characters')
	// checking password
	if (password.length < 8) return err('password should be atleast 8 characters')
	if (adminPassword.length < 8) return err('admin password should be atleast 8 characters')
	// checking phone
	if (phone && (phone < 1000000000 || phone > 9999999999)) return err('invalid phone no.');
	// email
	if (email && (!email.includes('@') || email.includes(' '))) return err('invalid gmail address');

	return true
}