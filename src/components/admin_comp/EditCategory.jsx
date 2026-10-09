import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AdditionalForm from "./AdditionalForm";
import { getSelectedCategory } from "../../redux/thunks/categoryThunk";

export default function EditCategory() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategory = async () => {
      const result = await dispatch(getSelectedCategory(slug));
    };

    fetchCategory();
  }, [dispatch, slug]);

  return <AdditionalForm isEdit={true} />;
}
