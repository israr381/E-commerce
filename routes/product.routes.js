import express from 'express';
import { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct
} from '../controllers/product.controller.js';
import { protect } from '../middleware/authmiddleware.js'; 
import upload from '../middleware/multer.middleware.js'; // Import the upload middleware

const router = express.Router();

router.post('/', protect, upload.single('image'), createProduct); // Add the upload middleware
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, upload.single('image'), updateProduct); // Add the upload middleware
router.delete('/:id', protect, deleteProduct);

export default router;
