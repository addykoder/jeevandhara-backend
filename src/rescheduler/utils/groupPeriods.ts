import { classesType, requestedRescheduleType } from "../../utils/types";
import getClass from "./getClass";

export default function groupPeriods(periods: requestedRescheduleType[], classes: classesType[]) {
	const res: { [key: string]: requestedRescheduleType[] } = {};

	for (const period of periods) {
		// if already an object there push it to the array
		// otherwise create a new array with period in it
		res[String(period.period)] !== undefined? res[String(period.period)].push(period) : res[String(period.period)] = [period]
	}

	// sorting each period array to have senior classes first
	// this will reduce the chances of teachers not available
	// for senior classes because they were previously
	// asssigned to junior classes according to the new system

	for (const period in res) {
		res[period].sort((a, b): number => {
			if (getClass(classes, a.className)?.handlingLevel >  getClass(classes, b.className)?.handlingLevel) return -1;
			else if (getClass(classes, a.className)?.handlingLevel < getClass(classes, b.className)?.handlingLevel) return 1;
			return 0;
		});
	}

	return res;
}
