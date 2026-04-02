const express = require("express");
const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} = require("../controller/categoryController");
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

const router = express.Router();

router.route("/categories").get(getAllCategories);

router.route("/admin/category/new").post(isAuthentictedUser, authorizeRoles("admin"), createCategory);

router.route("/admin/category/:id")
    .put(isAuthentictedUser, authorizeRoles("admin"), updateCategory)
    .delete(isAuthentictedUser, authorizeRoles("admin"), deleteCategory);

module.exports = router;