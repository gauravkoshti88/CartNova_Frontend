import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Ban,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  blockCustomer,
  unblockCustomer,
} from "../../redux/thunks/customerThunk";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Customers() {
  useDocumentTitle("Customers | Admin");

  const dispatch = useDispatch();

  const {
    customers = [],
    customer = null,
    loading = false,
    detailsLoading = false,
    actionLoading = false,
    pagination = {},
  } = useSelector((state) => state.customer || {});

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [actionCustomer, setActionCustomer] = useState(null);

  const [blockOpen, setBlockOpen] = useState(false);
  const [blockCustomerData, setBlockCustomerData] = useState(null);
  const [blockReason, setBlockReason] = useState("");

  const [processingCustomerId, setProcessingCustomerId] = useState(null);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const limit = 10;

  useEffect(() => {
    dispatch(
      getAllCustomers({
        page,
        limit,
        search,
        status,
      }),
    );
  }, [dispatch, page, search, status]);

  const stats = useMemo(() => {
    const total = pagination.totalCustomers || 0;

    return {
      total,
      active:
        status === "active"
          ? total
          : customers.filter((item) => !item.isBlocked).length,
      blocked:
        status === "blocked"
          ? total
          : customers.filter((item) => item.isBlocked).length,
    };
  }, [customers, pagination.totalCustomers, status]);

  const openView = async (id) => {
    if (!id) {
      toast.error("Customer ID is missing.");
      return;
    }

    try {
      const result = await dispatch(getCustomerById(id)).unwrap();

      setSelectedCustomer(result.customer);
      setViewOpen(true);
    } catch (err) {
      toast.error(err?.message || "Unable to load customer.");
    }
  };

  const openEdit = (item) => {
    if (!item?._id) {
      toast.error("Customer ID is missing.");
      return;
    }

    setActionCustomer(item);

    setEditForm({
      firstName: item.firstName || "",
      lastName: item.lastName || "",
      email: item.email || "",
      phone: item.phone || "",
    });

    setEditOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!actionCustomer?._id) {
      toast.error("Customer ID is missing.");
      return;
    }

    try {
      await dispatch(
        updateCustomer({
          id: actionCustomer._id,
          data: editForm,
        }),
      ).unwrap();

      toast.success("Customer updated successfully.");

      setEditOpen(false);
      setActionCustomer(null);

      await dispatch(
        getAllCustomers({
          page,
          limit,
          search,
          status,
        }),
      ).unwrap();
    } catch (err) {
      toast.error(err?.message || "Failed to update customer.");
    }
  };

  const handleDelete = async () => {
    if (!actionCustomer?._id) {
      toast.error("Customer ID is missing.");
      return;
    }

    try {
      await dispatch(deleteCustomer(actionCustomer._id)).unwrap();

      toast.success("Customer deleted successfully.");

      setDeleteOpen(false);
      setActionCustomer(null);

      await dispatch(
        getAllCustomers({
          page,
          limit,
          search,
          status,
        }),
      ).unwrap();
    } catch (err) {
      toast.error(err?.message || "Failed to delete customer.");
    }
  };

  const handleBlockToggle = async (item) => {
    if (!item?._id) {
      toast.error("Customer ID not found.");
      return;
    }

    try {
      if (item.isBlocked) {
        await dispatch(unblockCustomer(item._id)).unwrap();

        toast.success("Customer unblocked successfully.");
      } else {
        setActionCustomer(item);
        setBlockReason("");
        setBlockOpen(true);
        return;
      }

      await dispatch(
        getAllCustomers({
          page,
          limit,
          search,
          status,
        }),
      ).unwrap();
    } catch (err) {
      toast.error(
        err?.message ||
          `Failed to ${item.isBlocked ? "unblock" : "block"} customer.`,
      );
    }
  };

  const handleConfirmBlock = async () => {
    const id = blockCustomerData?._id;
    const reason = blockReason.trim();

    if (!id) {
      toast.error("Customer ID is missing.");
      return;
    }

    if (!reason) {
      toast.error("Please enter a reason for blocking.");
      return;
    }

    if (processingCustomerId === id) {
      return;
    }

    setProcessingCustomerId(id);

    try {
      await dispatch(
        blockCustomer({
          id,
          reason,
        }),
      ).unwrap();

      toast.success("Customer blocked successfully.");

      setBlockOpen(false);
      setBlockCustomerData(null);
      setBlockReason("");

      await dispatch(
        getAllCustomers({
          page,
          limit,
          search,
          status,
        }),
      ).unwrap();
    } catch (err) {
      toast.error(err?.message || "Failed to block customer.");
    } finally {
      setProcessingCustomerId(null);
    }
  };

  const closeBlockModal = () => {
    if (processingCustomerId) {
      return;
    }

    setBlockOpen(false);
    setBlockCustomerData(null);
    setBlockReason("");
  };

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Customer Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your customers, accounts and access.
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            title="Total Customers"
            value={pagination.totalCustomers || 0}
          />

          <StatCard
            icon={UserCheck}
            title="Active Customers"
            value={
              status === "active"
                ? pagination.totalCustomers || 0
                : stats.active
            }
          />

          <StatCard
            icon={UserX}
            title="Blocked Customers"
            value={
              status === "blocked"
                ? pagination.totalCustomers || 0
                : stats.blocked
            }
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, email or phone..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                {[
                  ["all", "All"],
                  ["active", "Active"],
                  ["blocked", "Blocked"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => changeStatus(value)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                      status === value
                        ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-700 dark:text-emerald-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left dark:border-slate-800 dark:bg-slate-950/40">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Joined
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <LoadingRows />
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center">
                      <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />

                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        No customers found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  customers.map((item) => (
                    <CustomerRow
                      key={item._id}
                      customer={item}
                      processing={processingCustomerId === item._id}
                      onView={() => openView(item._id)}
                      onEdit={() => openEdit(item)}
                      onDelete={() => {
                        setActionCustomer(item);
                        setDeleteOpen(true);
                      }}
                      onBlock={() => handleBlockToggle(item)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-800 dark:text-white">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800 dark:text-white">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
              >
                <ChevronLeft size={17} />
              </button>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {viewOpen && (
          <CustomerViewModal
            customer={selectedCustomer}
            loading={detailsLoading}
            onClose={() => {
              setViewOpen(false);
              setSelectedCustomer(null);
            }}
          />
        )}

        {editOpen && (
          <EditCustomerModal
            form={editForm}
            setForm={setEditForm}
            loading={actionLoading}
            onSubmit={handleEdit}
            onClose={() => {
              setEditOpen(false);
              setActionCustomer(null);
            }}
          />
        )}

        {deleteOpen && (
          <DeleteModal
            customer={actionCustomer}
            loading={actionLoading}
            onConfirm={handleDelete}
            onClose={() => {
              setDeleteOpen(false);
              setActionCustomer(null);
            }}
          />
        )}

        {blockOpen && (
          <BlockCustomerModal
            customer={blockCustomerData}
            reason={blockReason}
            setReason={setBlockReason}
            loading={processingCustomerId === blockCustomerData?._id}
            onConfirm={handleConfirmBlock}
            onClose={closeBlockModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function CustomerRow({
  customer,
  processing,
  onView,
  onEdit,
  onDelete,
  onBlock,
}) {
  const [menu, setMenu] = useState(false);

  const name =
    customer.name ||
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "Unknown Customer";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <tr className="group transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {customer.profileImage?.url ? (
            <img
              src={customer.profileImage.url}
              alt={name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {initials}
            </div>
          )}

          <div>
            <p className="font-semibold text-slate-800 dark:text-white">
              {name}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {customer.customerId || customer._id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {customer.email}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {customer.phone || "No phone"}
        </p>
      </td>

      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
        {customer.createdAt
          ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            customer.isBlocked
              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          }`}
        >
          {customer.isBlocked ? "Blocked" : "Active"}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="relative flex justify-end">
          <button
            type="button"
            disabled={processing}
            onClick={() => setMenu((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {processing ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <MoreVertical size={18} />
            )}
          </button>

          <AnimatePresence>
            {menu && !processing && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: -5,
                }}
                className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                <ActionButton
                  icon={Eye}
                  label="View Customer"
                  onClick={() => {
                    setMenu(false);
                    onView();
                  }}
                />

                <ActionButton
                  icon={Pencil}
                  label="Edit Customer"
                  onClick={() => {
                    setMenu(false);
                    onEdit();
                  }}
                />

                <ActionButton
                  icon={customer.isBlocked ? ShieldCheck : Ban}
                  label={customer.isBlocked ? "Unblock" : "Block"}
                  danger={!customer.isBlocked}
                  onClick={() => {
                    setMenu(false);
                    onBlock();
                  }}
                />

                <ActionButton
                  icon={Trash2}
                  label="Delete Customer"
                  danger
                  onClick={() => {
                    setMenu(false);
                    onDelete();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </tr>
  );
}

function ActionButton({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function BlockCustomerModal({
  customer,
  reason,
  setReason,
  loading,
  onConfirm,
  onClose,
}) {
  const name =
    customer?.name ||
    `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() ||
    "this customer";

  return (
    <Modal onClose={onClose} small>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
            <Ban size={22} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Block Customer
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              You are about to block{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {name}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Block Reason
              </span>

              <span className="text-xs text-slate-400">Required</span>
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for blocking this customer..."
              rows={4}
              maxLength={500}
              disabled={loading}
              autoFocus
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-red-500"
            />

            <div className="mt-1.5 flex justify-end">
              <span className="text-xs text-slate-400">
                {reason.length}/500
              </span>
            </div>
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 dark:border-red-500/10 dark:bg-red-500/10">
          <div className="flex gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />

            <p className="text-xs leading-5 text-red-600 dark:text-red-400">
              Blocking this customer will prevent them from accessing their
              account and using customer features until they are unblocked.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading || !reason.trim()}
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}

            {loading ? "Blocking..." : "Block Customer"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function CustomerViewModal({ customer, loading, onClose }) {
  if (!customer && !loading) {
    return null;
  }

  const name =
    customer?.name ||
    `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();

  return (
    <Modal onClose={onClose}>
      {loading ? (
        <div className="flex min-h-72 items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          <ModalHeader
            title="Customer Details"
            subtitle="Complete customer information"
            onClose={onClose}
          />

          <div className="space-y-6 p-5">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              {customer.profileImage?.url ? (
                <img
                  src={customer.profileImage.url}
                  alt={name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                  {name
                    ?.split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {name}
                </h3>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    customer.isBlocked
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {customer.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Info icon={Mail} label="Email" value={customer.email} />

              <Info icon={Phone} label="Phone" value={customer.phone} />

              <Info
                icon={CalendarDays}
                label="Joined"
                value={
                  customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString("en-IN")
                    : "—"
                }
              />

              <Info
                icon={MapPin}
                label="Addresses"
                value={`${customer.addresses?.length || 0} saved`}
              />
            </div>

            {customer.isBlocked && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                  Block Reason
                </p>

                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {customer.blockedReason ||
                    customer.blockReason ||
                    "No reason provided."}
                </p>

                {customer.blockedAt && (
                  <p className="mt-2 text-xs text-red-500">
                    Blocked on{" "}
                    {new Date(customer.blockedAt).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            )}

            {customer.addresses?.length > 0 && (
              <div>
                <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">
                  Saved Addresses
                </h4>

                <div className="space-y-3">
                  {customer.addresses.map((address) => (
                    <div
                      key={address._id}
                      className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                    >
                      <p className="font-medium text-slate-800 dark:text-white">
                        {address.name}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {address.addressLine1}
                        {address.addressLine2
                          ? `, ${address.addressLine2}`
                          : ""}
                        , {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-200">
        {value || "—"}
      </p>
    </div>
  );
}

function EditCustomerModal({ form, setForm, loading, onSubmit, onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Edit Customer"
        subtitle="Update customer information"
        onClose={onClose}
      />

      <form onSubmit={onSubmit} className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                firstName: value,
              }))
            }
          />

          <Input
            label="Last Name"
            value={form.lastName}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                lastName: value,
              }))
            }
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              email: value,
            }))
          }
        />

        <Input
          label="Phone"
          value={form.phone}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              phone: value,
            }))
          }
        />

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </label>
  );
}

function DeleteModal({ customer, loading, onConfirm, onClose }) {
  const name =
    customer?.name ||
    `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();

  return (
    <Modal onClose={onClose} small>
      <div className="p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
          <AlertTriangle size={26} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Delete Customer?
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {name}
          </span>
          ? This will deactivate the customer account.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            type="button"
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose, small = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 ${
          small ? "max-w-md" : "max-w-2xl"
        }`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function LoadingRows() {
  return Array.from({ length: 6 }).map((_, index) => (
    <tr key={index}>
      {Array.from({ length: 5 }).map((__, cell) => (
        <td key={cell} className="px-5 py-5">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </td>
      ))}
    </tr>
  ));
}
