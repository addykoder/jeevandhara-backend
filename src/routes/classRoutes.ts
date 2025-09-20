import { Router } from 'express';
import updateClasses from '../controllers/class/updateClasses';
import getClasses from '../controllers/class/getClasses'
import renameClass from '../controllers/class/renameClass'

export const router = Router();

router.post('/update', updateClasses);
router.post('/rename', renameClass)
router.get('/', getClasses)
