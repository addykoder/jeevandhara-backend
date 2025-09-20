import { resp, unexpectedError } from '../../utils/formatResponse';
import { schoolDatatype } from '../../utils/types';

export default async function getSubscriptionStatus(school: schoolDatatype) {
	try {
		const subscription = school.subscription
		
		const todate = new Date()
		if (subscription.expiresOn[subscription.expiresOn.length-1] < todate) return resp({ status: 'expired', ...subscription })
		// else is active state
		return resp({ status: 'active', ...subscription })

	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
