import mongoose, { Schema } from "mongoose";
var CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    "enum": ["active", "draft"],
    "default": "draft"
  },
  thumbnail: {
    type: Object,
    required: false,
    "default": {
      url: "https://res.cloudinary.com/dquzat4lc/image/upload/v1715714089/Loose/pxczt8xvzvpxdslcy605.jpg"
    }
  },
  products: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Products"
    }],
    "default": []
  }
});
export default mongoose.model("Category", CategorySchema);