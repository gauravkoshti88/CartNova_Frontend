import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/thunks/productThunk";

export const useProducts = () => {
    const dispatch = useDispatch();

    const { products, loading } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    return { products, loading };
};