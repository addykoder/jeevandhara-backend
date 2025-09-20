import { err, msg} from '../../utils/formatResponse';
import { validatePaymentVerification} from 'razorpay/dist/utils/razorpay-utils';
import schoolModel from '../../models/schoolDB';
import { annualPrise, monthlyPrise } from '../../utils/constants';

export default async function verifyCheckout(orderCreationId: string, razorpayPaymentId: string, razorpayOrderId: string, signature: string, id: string, secret: string, username:string) {

	const authenticity = validatePaymentVerification({"order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret)

	if (!authenticity) return err('Authentication failed')

	const school = await schoolModel.findOne({ username });
	if (!school) return err('error in fetching school information')
	for (const ind in school.payments) {
		if (school.payments[ind].order.id === orderCreationId) {
			// here proceed with updating the subscription 
			school.payments[ind].checkout = {razorpayPaymentId, razorpayOrderId, signature }
			school.payments[ind].success = true

			const expiresOn = school.subscription.expiresOn[school.subscription.expiresOn.length-1]
			
			if (school.payments[ind].amount === monthlyPrise) {

				if (new Date(expiresOn) >= new Date()) {
					school.subscription.expiresOn.push(new Date(new Date(expiresOn).setMonth(new Date(expiresOn).getMonth() + 1)))
				}	
				
				else {
					school.subscription.expiresOn.push(new Date( new Date().setMonth(new Date().getMonth() + 1)))
				}
				
			}


			if (school.payments[ind].amount === annualPrise) {

				if (new Date(expiresOn) >= new Date()) {
					school.subscription.expiresOn.push(new Date(new Date(expiresOn).setFullYear(new Date(expiresOn).getFullYear() + 1)))
				}	
				
				else {
					school.subscription.expiresOn.push(new Date( new Date().setFullYear(new Date().getFullYear() + 1)))
				}
				
			}


		}
	}

	school.save()
	return msg('Payment captured successfully')

	
}
