import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeletedCategories } from "../redux/thunks/categoryThunk";
import { getAllDeletedSubCategories } from "../redux/thunks/subCategoryThunk";
import { getAllDeletedBrands } from "../redux/thunks/brandThunk";

export const useGetAllDeletedData = (pageName) => {
    const dispatch = useDispatch();

    const { deletedCategories, loading } = useSelector((state) => state.category);

    const { deletedSubCategories, loading } = useSelector((state) => state.subCategory);

    const { deletedBrands, loading } = useSelector((state) => state.brand);

    useEffect(() => {
        if (pageName === "Category") {
            dispatch(getAllDeletedCategories());
        } else if (pageName === "Sub-Category") {
            dispatch(getAllDeletedSubCategories());
        } else {
            dispatch(getAllDeletedBrands());
        }
    }, [dispatch, pageName]);

    if (pageName === "Category") {
        return {
            deletedCategories,
            loading: categoryLoading,
        };
    } else if (pageName === "Sub-Category") {
        return {
            deletedSubCategories,
            loading: subCategoryLoading,
        };
    } else {
        return {
            deletedBrands,
            loading: brandLoading,
        };
    }
};