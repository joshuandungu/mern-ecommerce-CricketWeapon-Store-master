const Category = require("../model/categoryModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");

// Create Category -- Admin
exports.createCategory = asyncWrapper(async (req, res, next) => {
    const category = await Category.create(req.body);
    res.status(201).json({
        success: true,
        category,
    });
});

// Get All Categories
exports.getAllCategories = asyncWrapper(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        categories,
    });
});

// Update Category -- Admin
exports.updateCategory = asyncWrapper(async (req, res, next) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        category,
    });
});

// Delete Category -- Admin
exports.deleteCategory = asyncWrapper(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    await category.deleteOne();

    res.status(200).json({
        success: true,
        message: "Category Deleted Successfully",
    });
});