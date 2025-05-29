import express from 'express';
import { UserDta } from '../controllers/userGetData.controllers';

const router = express.Router();
import asignIdInLocals from '../middlewares/AssignIdOnLocals.middleware';
import isAuthenticated from '../middlewares/isAuthenticated.middleware';

// @ts-ignore
router.get('/userdata',isAuthenticated, asignIdInLocals, UserDta);

export default router;