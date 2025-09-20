import { err, resp } from '../../utils/formatResponse';
import Razorpay from 'razorpay';
import schoolModel from '../../models/schoolDB';
import { annualPrise, monthlyPrise } from '../../utils/constants';

export default async function createOrder(username:string, orderType: 'mon' | 'ann', id: string, secret: string) {
	try {
		const amount = orderType === 'mon' ? monthlyPrise : annualPrise;
		const razorpay = new Razorpay({ key_id: id, key_secret: secret });
		const options = {
			amount:amount*100,
			currency: 'INR',
		};

		const response = await razorpay.orders.create(options);
		const order = {
			amount: amount*100,
			payId: id,
			orderId: response.id
		}

		// saving the order details in server

		const school = await schoolModel.findOne({ username });
		if (!school) return err('error in fetching school information')
		school.payments.push({
			date: new Date(),
			order: response,
			amount,
			success: false,
		})
		school.save()


		return resp(order);
	} catch {
		return err('Some error in processing payment')
	}
}
