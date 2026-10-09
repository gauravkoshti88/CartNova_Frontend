import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSelectedCategory } from "../redux/thunks/categoryThunk";
import { getSelectedSubCategory } from "../redux/thunks/subCategoryThunk";
import { getSelectedBrand } from "../redux/thunks/brandThunk";
import { getChildCategoryBySlug } from "../redux/thunks/childCategoryThunk";

export const useGetActionInfo = (slug, mode, pageName) => {
  const dispatch = useDispatch();

  const {
    category,
    existSubCategory,
    productCount: categoryProductCount,
    loading: categoryLoading,
  } = useSelector((state) => state.category);

  const {
    subCategory,
    productCount: subCategoryProductCount,
    loading: subCategoryLoading,
  } = useSelector((state) => state.subCategory);

  const {
    brand,
    productCount: brandProductCount,
    loading: brandLoading,
  } = useSelector((state) => state.brand);

  const {
    childCategory,
    productCount: childCategoryProductCount,
    loading: childCategoryLoading,
  } = useSelector((state) => state.childCategory);

  useEffect(() => {
    if (!slug) return;

    if (mode !== "view" && mode !== "delete") {
      return;
    }

    if (pageName === "Category") {
      dispatch(getSelectedCategory(slug));
    } else if (pageName === "Sub-Category") {
      dispatch(getSelectedSubCategory(slug));
    } else if (pageName === "Child-Category") {
      dispatch(getChildCategoryBySlug(slug));
    } else if (pageName === "Brand") {
      dispatch(getSelectedBrand(slug));
    }
  }, [dispatch, slug, pageName, mode]);

  if (pageName === "Category") {
    return {
      category,
      productCount: categoryProductCount,
      existSubCategory,
      loading: categoryLoading,
    };
  }

  if (pageName === "Sub-Category") {
    return {
      subCategory,
      productCount: subCategoryProductCount,
      loading: subCategoryLoading,
    };
  }

  if (pageName === "Child-Category") {
    return {
      childCategory,
      productCount: childCategoryProductCount,
      loading: childCategoryLoading,
    };
  }

  return {
    brand,
    productCount: brandProductCount,
    loading: brandLoading,
  };
};
