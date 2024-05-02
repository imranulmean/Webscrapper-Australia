import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getproducts } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/getproducts', getproducts)

export default router;