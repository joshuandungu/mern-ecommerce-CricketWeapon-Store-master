import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { getAllCategories, deleteCategory, clearErrors } from "../../actions/categoryAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layouts/MataData/MataData";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { DELETE_CATEGORY_RESET } from "../../constants/categoryConstants";
import useStyles from "../User/LoginFromStyle";

const CategoryList = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { error, categories } = useSelector((state) => state.allCategories);
    const { error: deleteError, isDeleted } = useSelector((state) => state.category);

    const deleteCategoryHandler = (id) => {
        dispatch(deleteCategory(id));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success("Category Deleted Successfully");
            history.push("/admin/categories");
            dispatch({ type: DELETE_CATEGORY_RESET });
        }
        dispatch(getAllCategories());
    }, [dispatch, alert, error, deleteError, history, isDeleted]);

    const columns = [
        { field: "id", headerName: "Category ID", minWidth: 300, flex: 1 },
        { field: "name", headerName: "Name", minWidth: 150, flex: 0.5 },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Button onClick={() => deleteCategoryHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    const rows = [];
    categories &&
        categories.forEach((item) => {
            rows.push({
                id: item._id,
                name: item.name,
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL CATEGORIES - Admin`} />
            <div className={classes.updateProduct}>
                <div className={classes.firstBox1}>
                    <SideBar />
                </div>
                <div className={classes.secondBox1}>
                    <h1 id="productListHeading">ALL CATEGORIES</h1>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default CategoryList;