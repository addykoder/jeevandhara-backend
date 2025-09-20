import { notifiedDatatype, reschedulesDatatype, schoolDatatype } from '../../utils/types';
import groupReschedulesByTeacher from '../../utils/groupReschedulesByTeacher';
import sendSMS from './sendSMS';
import sendWhatsapp from './sendWhatsapp';
import sendEmail from './sendEmail';
import beautifyReschedules from '../../utils/beautifyReschedules';
import { err, msg, unexpectedError } from '../../utils/formatResponse';
import setNotified from '../reschedule/setNotified';

export default async function notifyTeachers(school: schoolDatatype, reschedules: reschedulesDatatype[]) {
	try {
		// checking if the notification is not been sent twice
		// only if the attendance version is different than messaged version
		// if it is equal return error
		if (school.attendanceVersion === school.messagedVersion) return err('message already sent to teachers');
		// *** grouping all teachers
		const groupedReschedules = groupReschedulesByTeacher(reschedules);

		const notified: notifiedDatatype[] = [];

		let emailSent = 0;
		let smsSent = 0;
		let whatsappSent = 0;

		for (const teacher of Object.values(groupedReschedules)) {
			// creating the message to send
			const contentToSend = `Good Morning ${teacher.name}\nYour Substitutions : ${new Date().toISOString().slice(0, 10)}\n\n${beautifyReschedules(teacher.reschedules)}`;
			// if teacher messaging is not none and school has the messaging enabled
			if (teacher.messagingPreference && teacher.messagingPreference !== 'none' && school.messagingSubscribed.includes(teacher.messagingPreference)) {
				// if it is whatsapp type
				if (teacher.messagingPreference === 'whatsapp' && teacher.phone) {
					const resp = await sendWhatsapp(teacher.phone, contentToSend).catch(() => false);
					whatsappSent++;
					// notified is resp!=false because if obove catch block runs it's value is false and will give notified: false
					notified.push({ id: teacher.id, name: teacher.name, way: teacher.messagingPreference, notified: resp!==false });
				}
				// if it is sms
				else if (teacher.messagingPreference === 'sms' && teacher.phone) {
					const resp = await sendSMS(teacher.phone, contentToSend).catch(() => false);
					smsSent++;
					notified.push({ id: teacher.id, name: teacher.name, way: teacher.messagingPreference, notified: resp!==false });
				}
				// if it is email
				else if (teacher.messagingPreference === 'email' && teacher.email) {
					const resp = await sendEmail(teacher.email, contentToSend).catch(() => false);
					emailSent++;
					notified.push({ id: teacher.id, name: teacher.name, way: teacher.messagingPreference, notified: resp!==false});
				}
				// message is not sent 
				else {
					notified.push({ id: teacher.id, name: teacher.name, way: teacher.messagingPreference, notified: false});
				}
			}
			// message is not sent 
			else {
				notified.push({ id: teacher.id, name: teacher.name, way: teacher.messagingPreference, notified: false});
			}
		}

		// after sending all messages incrementing the no. of messages sent in database
		school.subscription.emailSent = school.subscription.emailSent + emailSent;
		school.subscription.smsSent = school.subscription.smsSent + smsSent;
		school.subscription.whatsappSent = school.subscription.whatsappSent + whatsappSent;
		// changing messaged version to attendance version
		school.messagedVersion = school.attendanceVersion;
		Object(school).save();
		// setting the notified object of attendance
		setNotified(notified, school.attendanceCollection)

		return msg('notified successfully');
	} catch (e) {
		console.log(e);
		return unexpectedError;
	}
}
