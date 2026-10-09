import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllChildCategory,
  getChildCategoriesBySubCategorySlug,
} from "../redux/thunks/childCategoryThunk";

export const useChildCategories = (subCategorySlug) => {
  const dispatch = useDispatch();

  const {
    childCategories = [],
    childCategoriesLoading = false,
    childCategoriesError = null,
  } = useSelector((state) => state.childCategory);

  useEffect(() => {
    if (subCategorySlug) {
      dispatch(getChildCategoriesBySubCategorySlug(subCategorySlug));
    } else {
      dispatch(getAllChildCategory());
    }
  }, [dispatch, subCategorySlug]);

  return {
    childCategories,
    loading: childCategoriesLoading,
    error: childCategoriesError,
  };
};
