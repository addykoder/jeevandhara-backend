import { schoolDatatype } from "../../utils/types";
import { resp } from "../../utils/formatResponse";

export default async function getSubscriptionHistory(school:schoolDatatype) {
	return resp(school.payments)
}