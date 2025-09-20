import { Router } from "express";
import getSubscriptionStatus from "../controllers/subscription/getSubscriptionStatus";
import getSubscriptionHistory from "../controllers/subscription/getSubscriptionHistory";
import createOrder from "../controllers/subscription/createOrder";
import verifyCheckout from "../controllers/subscription/verifyCheckout";

export const router = Router()

router.get('/status', getSubscriptionStatus)
router.get('/history', getSubscriptionHistory)
router.post('/createOrder', createOrder)
router.post('/verifyCheckout', verifyCheckout)