import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductBySlug } from "../redux/thunks/productThunk";

export const useGetProductActionInfo = (slug) => {

    const dispatch = useDispatch();

    const {
        product,
        loading
    } = useSelector(
        state => state.product
    );

    useEffect(() => {
        if (slug) {
            dispatch(getProductBySlug(slug));
        }
    }, [slug]);

    return {
        product,
        loading
    }
}