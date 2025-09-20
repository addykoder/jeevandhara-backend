import { schoolDatatype } from '../../utils/types';

export default function isSubscribed(school: schoolDatatype) {
	const subscription = school.subscription;
	if (subscription.expiresOn[subscription.expiresOn.length-1] >= new Date()) return true;
	return false;
}
