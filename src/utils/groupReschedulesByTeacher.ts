import { reschedulesDatatype } from "./types";

export default function groupReschedulesByTeacher(reschedules: reschedulesDatatype[]) {
	const reschedulesGroupedByTeacher: {[key:string]: {name:string, id:number, messagingPreference: string,phone?: number, email?: string, reschedules: {className: string, periodNo: number, for: string}[]}} = {}	
	// grouping reschedules based on teacher
	for (const reschedule of reschedules) {
		if (`${reschedule.teacherId}` in reschedulesGroupedByTeacher) {
			reschedulesGroupedByTeacher[`${reschedule.teacherId}`].reschedules.push({className: reschedule.className, periodNo:reschedule.periodNo, for:reschedule.for})
			
		}
		// if teacher is present to take period and is not undefined
		else if(reschedule.teacherId && reschedule.teacherName && reschedule.teacherMessagingPreference) {
			reschedulesGroupedByTeacher[`${reschedule.teacherId}`] = {name: reschedule.teacherName, id: reschedule.teacherId, messagingPreference: reschedule.teacherMessagingPreference, phone: reschedule.teacherPhone, email: reschedule.teacherEmail, reschedules:[{className: reschedule.className, periodNo: reschedule.periodNo, for: reschedule.for}]}
		}
	}

	return reschedulesGroupedByTeacher
}