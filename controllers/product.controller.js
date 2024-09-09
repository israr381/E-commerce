import Product from '../models/product.models.js';
import { uploadOnCloundinary } from '../config/cloudanary.js';

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, countInStock } = req.body;

        const imageLocalFilePath = req.file?.path; 

        if (!imageLocalFilePath) {
            throw new Error("Product image is required");
        }

        const image = await uploadOnCloundinary(imageLocalFilePath);
        if (!image) {
            throw new Error("Image upload failed");
        }

        const product = new Product({
            name,
            description,
            price,
            countInStock,
            image: image.url, 
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: createdProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (product) {
            res.json({
                success: true,
                message: 'Product removed successfully',
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        });
    }
};


export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({
            success: true,
            message: 'ALl Product Product successfully',
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json({
                success: true,
                message: 'Product fetch successfully',

                data: product,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message,
        });
    }
};




export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, countInStock } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const imageLocalFilePath = req.file?.path;
        let imageUrl = product.image; 

        if (imageLocalFilePath) {
            const image = await uploadOnCloundinary(imageLocalFilePath);
            if (!image) {
                throw new Error("Image upload failed");
            }
            imageUrl = image.url; 
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.countInStock = countInStock || product.countInStock;
        product.image = imageUrl; 

        const updatedProduct = await product.save();
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message,
        });
    }
}

