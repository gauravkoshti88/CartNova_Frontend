import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../redux/thunks/categoryThunk";

export const useCategories = () => {
    const dispatch = useDispatch();

    const { categories, loading, loaded } = useSelector(
        (state) => state.category
    );

    useEffect(() => {
        if (!loaded) {
            dispatch(getCategories());
        }
    }, [dispatch, loaded]);

    return { categories, loading };
};