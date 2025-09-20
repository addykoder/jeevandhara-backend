import attendanceModelConstructor from '../../models/attendanceDB';
import { unexpectedError } from '../../utils/formatResponse';
import { attPrefDatatype, notifiedDatatype, reschedulesDatatype } from '../../utils/types';

export default async function getReschedules(attendanceCollection: string) {
	try {
		const attendance = attendanceModelConstructor(attendanceCollection);
		const attendanceObject = await attendance.findOne({ date: new Date().toISOString().slice(0, 10) }, '-_id').exec();
		if (!attendanceObject) return { reschedules: [], notified: [] };
		const reschedules: reschedulesDatatype[] = attendanceObject.reschedules;
		const notified: notifiedDatatype[] = attendanceObject.notified;
		const day: number = attendanceObject.day;
		const preferences: attPrefDatatype = attendanceObject.preferences;
		const preserve: boolean = attendanceObject.preserve;
		const preserveTill: number = attendanceObject.preserveTill
		const preservedReschedules: reschedulesDatatype[]= attendanceObject.preservedReschedules

		if (reschedules === undefined) return { reschedules: [], notified: [] };
		return { reschedules, notified, day, preferences, preserve, preserveTill, preservedReschedules };
	} catch (e) {
		console.log(e);
		return { ...unexpectedError, reschedules: null };
	}
}
