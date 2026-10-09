import { useMemo } from "react";
import { useSelector } from "react-redux";
import validateProduct from "../utils/productValidatior";

export default function useProductValidation() {

    const product = useSelector(

        state => state.product

    );

    const errors = useMemo(() => {

        return validateProduct(product);

    }, [product]);

    return {

        errors,

        isValid:

            Object.keys(errors).length === 0

    };

}