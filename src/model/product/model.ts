import mongoose, { Schema, Document } from 'mongoose';

// Define interface for Product document
interface IProduct extends Document {
    name: string;
    description: string;
    category: Schema.Types.ObjectId;
    status: 'active' | 'scheduled' | 'draft';
    photos: object[]; // Assuming photos are stored as URLs
    price: number;
    colors: string[];
    sizes: string[];
    publishDate: Date;
    discount: number;
    numOfSales: number;
}

// Define schema for Product
const ProductSchema: Schema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    status: { type: String, enum: ['active', 'scheduled', 'draft'], required: true },
    photos: { type: [Object], required: false, default: [
		{
			url: "https://res.cloudinary.com/dquzat4lc/image/upload/v1715714089/Loose/pxczt8xvzvpxdslcy605.jpg"
		}
	] },
    price: { type: Number, required: true },
    colors: { type: [String], required: true },
    sizes: { type: [String], required: true },
    publishDate: { type: Date, required: true },
    discount: { type: Number, default: 0 },
    numOfSales: { type: Number, default: 0 },
}, {
	timestamps: true,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

// Create and export the Product model
 
export default mongoose.model<IProduct>('Products', ProductSchema);
export type ProductType = IProduct;
