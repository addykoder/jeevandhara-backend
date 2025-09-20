
export default function beautifyReschedules(reschedules: { periodNo: number, className: string, for: string }[]) {
	let resp = ''
	for (const reschedule of reschedules) {
		resp = resp +  `Period: ${reschedule.periodNo}   Class: ${reschedule.className}   for: ${reschedule.for}\n\n`
	}
	return resp
}