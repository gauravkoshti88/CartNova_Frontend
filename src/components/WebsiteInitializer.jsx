import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWebsite } from "../redux/thunks/websiteThunk";

const WebsiteInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const { website, loading } = useSelector((state) => state.website);

  useEffect(() => {
    if (!website) {
      dispatch(getWebsite());
    }
  }, [dispatch, website]);

  return children;
};

export default WebsiteInitializer;
