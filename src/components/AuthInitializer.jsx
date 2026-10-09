import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getAdmin } from "../redux/thunks/adminAuthThunk";
import { getUser } from "../redux/thunks/userAuthThunk";
import { getWishlist, mergeGuestWishlist } from "../redux/thunks/wishlistThunk";

import { getGuestWishlist } from "../utils/guestWishlist";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const userResult = await dispatch(getUser());

      if (getUser.fulfilled.match(userResult)) {
        const guestWishlist = getGuestWishlist();

        if (guestWishlist.length > 0) {
          await dispatch(mergeGuestWishlist());
        } else {
          await dispatch(getWishlist());
        }
      }

      await dispatch(getAdmin());
    };

    initializeAuth();
  }, [dispatch]);

  return children;
}
