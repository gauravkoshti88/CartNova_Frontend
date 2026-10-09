import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getProductBySlug } from "../../redux/thunks/productThunk";
import ProductForm from "./ProductForm";

export default function EditProduct() {

    const { slug } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(getProductBySlug(slug));

    }, [dispatch, slug]);

    return <ProductForm isEdit={true} />;

}