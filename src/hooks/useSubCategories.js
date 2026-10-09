import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSubCategories,
  getSubCategoriesByCategory,
} from "../redux/thunks/subCategoryThunk";

export const useSubCategories = (categorySlug) => {
  const dispatch = useDispatch();

  const { subCategories, loading } = useSelector((state) => state.subCategory);

  useEffect(() => {
    if (categorySlug) {
      dispatch(getSubCategoriesByCategory(categorySlug));
    } else {
      dispatch(getAllSubCategories());
    }
  }, [dispatch, categorySlug]);

  return {
    subCategories,
    loading,
  };
};
