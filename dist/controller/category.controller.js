import CategoryModel from "../model/category/model";
import asyncHandler from "../middlewares/async_handler";
import AppError from "../utils/app_error";
import cloudinary from "../middlewares/cloudinary_uploader";
import fs from "fs";
const CLOUD_OPTS = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: "Loose/categories",
};
class CategoryController {
    createCategory = asyncHandler(async (req, res, next) => {
        let tpub = "";
        if (req?.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, CLOUD_OPTS);
            tpub = public_id;
            req.body.thumbnail = { url: secure_url, public_id };
            if (public_id) {
                fs.unlinkSync(req.file.path);
            }
        }
        try {
            const category = await CategoryModel.create(req.body);
            res.status(201).json({ success: true, data: { category } });
        }
        catch (error) {
            if (tpub)
                await cloudinary.uploader.destroy(tpub);
            if (error.code === 11000) {
                return next(new AppError("Category already exists", 400));
            }
            return next(new AppError(error.message, 400));
        }
    });
    getAllCategories = asyncHandler(async (req, res, next) => {
        const categories = await CategoryModel.find();
        res.status(200).json({ success: true, data: { categories } });
    });
    getCategory = asyncHandler(async (req, res, next) => {
        const categoryId = req.params.id;
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return next(new AppError("Category not found", 404));
        }
        res.status(200).json({ success: true, data: { category } });
    });
    updateCategory = asyncHandler(async (req, res, next) => {
        const category = await CategoryModel.findById(req.params.id);
        if (!category) {
            return next(new AppError("Category not found", 404));
        }
        if (req?.file) {
            let OPTS = { ...CLOUD_OPTS };
            if (category.thumbnail?.public_id) {
                OPTS = {
                    overwrite: true,
                    public_id: category.thumbnail.public_id,
                };
            }
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, OPTS);
            req.body.thumbnail = { url: secure_url, public_id };
            if (public_id) {
                fs.unlinkSync(req.file.path);
            }
        }
        const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res
            .status(200)
            .json({ success: true, data: { category: updatedCategory } });
    });
    deleteCategory = asyncHandler(async (req, res, next) => {
        const categoryId = req.params.id;
        const category = await CategoryModel.findByIdAndDelete(categoryId);
        if (!category) {
            return next(new AppError("Category not found", 404));
        }
        if (category.thumbnail?.public_id) {
            await cloudinary.uploader.destroy(category.thumbnail.public_id);
        }
        res
            .status(200)
            .json({ success: true, message: "Category deleted successfully" });
    });
    draftCategory = asyncHandler(async (req, res, next) => {
        const categoryId = req.params.id;
        const category = await CategoryModel.findByIdAndUpdate(categoryId, { status: "draft" }, { new: true });
        if (!category) {
            return next(new AppError("Category not found", 404));
        }
        res
            .status(200)
            .json({ success: true, message: "Category drafted successfully" });
    });
}
export default new CategoryController();
