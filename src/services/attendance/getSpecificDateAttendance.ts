import attendanceModelConstructor from "../../models/attendanceDB"
import { err, resp, unexpectedError } from "../../utils/formatResponse"
import getAssignedTeachersSummary from "../reschedule/getAssignedTeachersSummary"


export default async function getSpecificDateAttendance(dateString: string, attendanceCollection: string, teacherCollection:string) {
	try{
		const attendance = attendanceModelConstructor(attendanceCollection)
		// this part is behaving differently in local and in server
		// use this for server
		const newDateString = new Date(dateString).toISOString().slice(0,10)
		// use this for local
		// const newDateString = new Date(new Date(dateString).setDate(new Date(dateString).getDate()+1)).toISOString().slice(0,10)
		const date = new Date(newDateString)	
		
		if (String(date) === 'Invalid Date') return err('invalid date')
		const requiredAttendace = await attendance.findOne({date: date})

		return resp({attendance: requiredAttendace, summary: await getAssignedTeachersSummary(attendanceCollection, teacherCollection, false, true, date.toISOString().slice(0, 10))})
	}
	catch (e) {
		console.log(e)
		return unexpectedError
	}
}
