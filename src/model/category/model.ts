import mongoose, { Schema, Document } from "mongoose";

interface Thumb {
	url: string;
	public_id: string;
}

export interface Category extends Document {
  name: string;
  description?: string;
  status: "active" | "draft";
  thumbnail: Thumb;
  products: Schema.Types.ObjectId[] | string[];
}

const CategorySchema = new Schema<Category>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "draft"],
    default: "draft",
  },
  thumbnail: {
    type: Object,
    required: false,
    default: {
      url: "https://res.cloudinary.com/dquzat4lc/image/upload/v1715714089/Loose/pxczt8xvzvpxdslcy605.jpg",
    },
  },
  products: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    default: [],
  },
});

export default mongoose.model<Category>("Category", CategorySchema);
