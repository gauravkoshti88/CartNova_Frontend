import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AdditionalForm from "./AdditionalForm";
import { getSelectedSubCategory } from "../../redux/thunks/subCategoryThunk";

export default function EditSubCategory() {

    const { slug } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(getSelectedSubCategory(slug));

    }, [dispatch, slug]);

    return <AdditionalForm isEdit={true} />;

}