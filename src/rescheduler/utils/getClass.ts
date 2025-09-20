import { classesType } from "../../utils/types";

export default function getClass(classes: classesType[], className: string) {
	return classes.filter(c => c.name === className)[0] 
}

