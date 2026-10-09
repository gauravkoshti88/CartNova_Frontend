import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrands, getBrandsByCategory } from "../redux/thunks/brandThunk";

export const useBrands = (categoryId) => {
    const dispatch = useDispatch();

    const {
        brands,
        loading
    } = useSelector((state) => state.brand);

    useEffect(() => {
        if (categoryId) {
            dispatch(getBrandsByCategory(categoryId));
        } else {
            dispatch(getAllBrands());
        }
    }, [dispatch, categoryId]);

    return {
        brands,
        loading,
    };
};