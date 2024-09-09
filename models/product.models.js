import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    image: { type: String, required: true }, 
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
