import express from 'express';
import { register, login, logout, getAllUsers, FindById } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/all', getAllUsers);
router.get('/findone/:userId', FindById)

export default router;
