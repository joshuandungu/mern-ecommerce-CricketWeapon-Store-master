import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createCategory, clearErrors } from "../../actions/categoryAction";
import { useAlert } from "react-alert";
import { Button, TextField } from "@material-ui/core";
import MetaData from "../layouts/MataData/MataData";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import SideBar from "./Sidebar";
import { NEW_CATEGORY_RESET } from "../../constants/categoryConstants";
import useStyles from "../User/LoginFromStyle";

const NewCategory = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, success } = useSelector((state) => state.newCategory);
    const [name, setName] = useState("");

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Category Created Successfully");
            history.push("/admin/dashboard");
            dispatch({ type: NEW_CATEGORY_RESET });
        }
    }, [dispatch, alert, error, history, success]);

    const createCategorySubmitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        dispatch(createCategory(myForm));
    };

    return (
        <Fragment>
            <MetaData title="Create Category" />
            <div className={classes.updateProduct}>
                <div className={classes.firstBox1}>
                    <SideBar />
                </div>
                <div className={classes.secondBox1}>
                    <form
                        className={classes.form}
                        onSubmit={createCategorySubmitHandler}
                    >
                        <h1>Create Category</h1>
                        <div>
                            <SpellcheckIcon />
                            <TextField
                                type="text"
                                placeholder="Category Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="outlined"
                                fullWidth
                                className={classes.textField}
                            />
                        </div>

                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false}
                            variant="contained"
                            color="primary"
                            className={classes.loginButton}
                            fullWidth
                        >
                            Create
                        </Button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default NewCategory;