
export function getHalveLimit(period:number, totalPeriods:number):[number, number] {
	if (period<=totalPeriods/2) return [0, Math.floor(totalPeriods/2)+1 ]
	return [Math.floor(totalPeriods/2)+1, totalPeriods+1]
}


export function isInHalve(period: number, halve: [number, number]) {
	return period >= halve[0] && period < halve[1]
}