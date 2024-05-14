import mongoose, { Schema, Document } from 'mongoose';

export interface Category extends Document {
  name: string;
  description?: string;
  status: 'active' | 'draft';
  thumbnail: object; 
  products: mongoose.Types.ObjectId[] | string[];
}

const CategorySchema = new Schema<Category>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'draft'],
    default: 'draft',
  },
  thumbnail: {
    type: Object,
    required: false,
	default: {
		url: "https://res.cloudinary.com/dquzat4lc/image/upload/v1715714089/Loose/pxczt8xvzvpxdslcy605.jpg"
	}
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Products',
  }],
});


export default mongoose.model<Category>('Category', CategorySchema);
