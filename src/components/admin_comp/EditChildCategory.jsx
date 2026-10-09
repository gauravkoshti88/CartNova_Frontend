import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getChildCategoryBySlug } from "../../redux/thunks/childCategoryThunk";
import ChildCategoryForm from "./ChildCategoryForm";

export default function EditChildCategory() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChildCategory = async () => {
      const result = await dispatch(getChildCategoryBySlug(slug));
    };

    fetchChildCategory();
  }, [dispatch, slug]);

  return <ChildCategoryForm isEdit={true} />;
}
