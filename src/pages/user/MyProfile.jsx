import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  X,
  Save,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { updateProfile } from "../../redux/thunks/userThunk";
import { clearUserError, clearUserMessage } from "../../redux/slices/userSlice";
import { useToast } from "../../hooks/useToast";
import { getUser } from "../../redux/thunks/userAuthThunk";
import { Heading } from "../../components/Heading";
import Breadcrumb from "../../components/Breadcrumb";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

// ============================================================
// EMPTY ADDRESS
// ============================================================

const emptyAddress = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  addressType: "home",
  isDefault: true,
};

export default function MyProfile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userAuth);

  const { loading, success, message, error } = useSelector(
    (state) => state.user,
  );

  useDocumentTitle("Profile");

  const [isEditing, setIsEditing] = useState(false);

  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: null,
    address: { ...emptyAddress },
  });

  // ============================================================
  // TOAST
  // ============================================================

  useToast({
    success,
    message,
    error,
    clearMessage: () => dispatch(clearUserMessage()),
    clearError: () => dispatch(clearUserError()),
  });

  // ============================================================
  // NORMALIZE ADDRESS
  // ============================================================

  const getAddress = (address) => {
    if (!address) {
      return { ...emptyAddress };
    }

    return {
      ...emptyAddress,
      ...address,
      isDefault: true,
    };
  };

  // ============================================================
  // LOAD USER
  // ============================================================

  useEffect(() => {
    if (!user) return;

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      profileImage: null,
      address: getAddress(user.address),
    });

    setPreview(user.profileImage?.url || "");
  }, [user]);

  // ============================================================
  // BASIC INPUT
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // ADDRESS INPUT
  // ============================================================

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
        isDefault: true,
      },
    }));
  };

  // ============================================================
  // PROFILE IMAGE
  // ============================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    // Single address
    data.append(
      "address",
      JSON.stringify({
        ...formData.address,
        isDefault: true,
      }),
    );

    // Profile image
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      await dispatch(updateProfile(data)).unwrap();

      await dispatch(getUser()).unwrap();

      setIsEditing(false);
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);
    }
  };

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      profileImage: null,
      address: getAddress(user.address),
    });

    setPreview(user.profileImage?.url || "");

    setIsEditing(false);
  };

  // ============================================================
  // NO USER
  // ============================================================

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Unable to load profile.</p>
      </div>
    );
  }

  // ============================================================
  // VIEW ADDRESS
  // ============================================================

  const address = user.address;

  // ============================================================
  // UI
  // ============================================================

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-5 dark:bg-slate-950 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb />

        {/* ================================================== */}
        {/* PAGE HEADING */}
        {/* ================================================== */}

        <AnimatePresence mode="wait">
          {/* ================================================= */}
          {/* SINGLE OUTER BOX */}
          {/* ================================================= */}

          <motion.div
            key={isEditing ? "edit" : "view"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="
              overflow-hidden
              rounded-3xl
              border border-gray-200
              bg-white
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            {!isEditing ? (
              <div className="p-5 sm:p-7 lg:p-5">
                <div className=" mb-6 flex justify-center">
                  <Heading
                    className="text-center"
                    heading="My Profile"
                    para="Manage your personal information and address"
                  />
                </div>

                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  {/* PROFILE IMAGE */}

                  <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                    {user.profileImage?.url ? (
                      <img
                        src={user?.profileImage?.url}
                        alt={user.profileImage.alt || "Profile"}
                        className="
                          h-full
                          w-full
                          rounded-full
                          object-cover
                          ring-4
                          ring-indigo-100
                          dark:ring-indigo-900
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          w-full
                          items-center
                          justify-center
                          rounded-full
                          bg-indigo-100
                          text-indigo-600
                          ring-4
                          ring-indigo-50
                          dark:bg-indigo-900/40
                          dark:ring-indigo-900
                        "
                      >
                        <User className="h-10 w-10" />
                      </div>
                    )}
                  </div>

                  {/* PROFILE INFO */}

                  <div className="min-w-0 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h2>

                    <div className="mt-3 space-y-2">
                      <p className="flex items-center justify-center gap-2 break-all text-sm text-gray-600 dark:text-gray-300 sm:justify-start">
                        <Mail
                          size={17}
                          className="shrink-0 text-indigo-600 dark:text-indigo-400"
                        />
                        {user.email}
                      </p>

                      <p className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 sm:justify-start">
                        <Phone
                          size={17}
                          className="shrink-0 text-indigo-600 dark:text-indigo-400"
                        />
                        {user.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================================================= */}
                {/* DIVIDER */}
                {/* ================================================= */}

                <div className="my-8 border-t border-gray-200 dark:border-slate-800" />

                {/* ================================================= */}
                {/* ADDRESS */}
                {/* ================================================= */}

                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Saved Address
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your default delivery address
                      </p>
                    </div>
                  </div>

                  {address ? (
                    <div className="mt-5 rounded-2xl bg-gray-50 p-5 dark:bg-slate-800/60">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold capitalize text-gray-900 dark:text-white">
                          {address.addressType || "Home"}
                        </h3>

                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Default
                        </span>
                      </div>

                      <div className="mt-4">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {address.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {address.phone}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>

                        {address.landmark && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Landmark: {address.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
                      <MapPin
                        size={32}
                        className="mx-auto mb-3 text-gray-400"
                      />

                      <p className="font-medium text-gray-600 dark:text-gray-300">
                        No saved address
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Add your delivery address by editing your profile.
                      </p>
                    </div>
                  )}
                </div>

                {/* ================================================= */}
                {/* EDIT BUTTON */}
                {/* ================================================= */}

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-xl
                      bg-indigo-600
                      px-5
                      py-2.5
                      font-medium
                      text-white
                      transition
                      hover:bg-indigo-700
                    "
                  >
                    <Pencil size={17} />
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              /* ================================================= */
              /* EDIT MODE */
              /* ================================================= */

              <form onSubmit={handleSubmit} className="p-5 sm:p-7 lg:p-8">
                {/* ================================================= */}
                {/* PERSONAL INFORMATION */}
                {/* ================================================= */}

                <div>
                  <div className="mb-6 flex justify-center">
                    <Heading
                      className="text-center"
                      heading="My Profile"
                      para="Manage your personal information and address"
                    />
                  </div>

                  {/* PROFILE IMAGE */}

                  <div className="mt-6 flex flex-col justify-center items-center gap-4 sm:flex-row">
                    <div className="relative h-24 w-24 shrink-0 ">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Profile preview"
                          className="
                            h-full
                            w-full
                            rounded-full
                            object-cover
                            ring-4
                            ring-indigo-100
                            dark:ring-indigo-900
                          "
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-slate-800">
                          <User size={35} />
                        </div>
                      )}
                    </div>

                    <label
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-gray-50
                        dark:border-slate-700
                        dark:text-gray-200
                        dark:hover:bg-slate-800
                      "
                    >
                      <Camera size={17} />
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* PERSONAL FIELDS */}

                  <div className="mt-7 grid gap-5 md:grid-cols-2">
                    <InputField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />

                    <InputField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />

                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />

                    <InputField
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* ================================================= */}
                {/* DIVIDER */}
                {/* ================================================= */}

                <div className="my-8 border-t border-gray-200 dark:border-slate-800" />

                {/* ================================================= */}
                {/* DELIVERY ADDRESS */}
                {/* ================================================= */}

                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Delivery Address
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your default delivery address
                      </p>
                    </div>
                  </div>

                  {/* ADDRESS FORM */}

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <InputField
                      label="Name"
                      value={formData.address.name}
                      onChange={(e) =>
                        handleAddressChange("name", e.target.value)
                      }
                    />

                    <InputField
                      label="Phone"
                      value={formData.address.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                    />

                    <InputField
                      label="Address Line 1"
                      value={formData.address.addressLine1}
                      onChange={(e) =>
                        handleAddressChange("addressLine1", e.target.value)
                      }
                    />

                    <InputField
                      label="Address Line 2"
                      value={formData.address.addressLine2}
                      onChange={(e) =>
                        handleAddressChange("addressLine2", e.target.value)
                      }
                    />

                    <InputField
                      label="City"
                      value={formData.address.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                    />

                    <InputField
                      label="State"
                      value={formData.address.state}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                    />

                    <InputField
                      label="Pincode"
                      value={formData.address.pincode}
                      onChange={(e) =>
                        handleAddressChange("pincode", e.target.value)
                      }
                    />

                    <InputField
                      label="Landmark"
                      value={formData.address.landmark}
                      onChange={(e) =>
                        handleAddressChange("landmark", e.target.value)
                      }
                    />

                    {/* ADDRESS TYPE */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address Type
                      </label>

                      <select
                        value={formData.address.addressType || "home"}
                        onChange={(e) =>
                          handleAddressChange("addressType", e.target.value)
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-gray-300
                          bg-white
                          px-4
                          py-3
                          text-gray-900
                          outline-none
                          transition
                          focus:border-indigo-500
                          focus:ring-2
                          focus:ring-indigo-500/20
                          dark:border-slate-700
                          dark:bg-slate-800
                          dark:text-white
                        "
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ================================================= */}
                {/* ACTIONS */}
                {/* ================================================= */}

                <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-gray-300
                      px-4
                      py-2.5
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-100
                      dark:border-slate-700
                      dark:text-gray-200
                      dark:hover:bg-slate-800
                    "
                  >
                    <X size={18} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-xl
                      bg-indigo-600
                      px-5
                      py-2.5
                      font-medium
                      text-white
                      transition
                      hover:bg-indigo-700
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {loading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================================
// INPUT COMPONENT
// ============================================================

function InputField({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-3
          text-gray-900
          outline-none
          transition
          focus:border-indigo-500
          focus:ring-2
          focus:ring-indigo-500/20
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-white
        "
      />
    </div>
  );
}
