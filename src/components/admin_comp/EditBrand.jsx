import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AdditionalForm from "./AdditionalForm";
import { getSelectedBrand } from "../../redux/thunks/brandThunk";


export default function EditBrand() {

    const { slug } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(getSelectedBrand(slug));

    }, [dispatch, slug]);

    return <AdditionalForm isEdit={true} />;

}