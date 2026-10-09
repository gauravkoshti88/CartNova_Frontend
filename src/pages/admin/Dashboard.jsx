import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  ShoppingBag,
  Package,
  IndianRupee,
  Layers3,
  Tags,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
  Loader2,
  Boxes,
  CreditCard,
  Banknote,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getDashboard } from "../../redux/thunks/dashboardThunk";
import { Heading } from "../../components/Heading";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Dashboard() {
  useDocumentTitle("Dashboard | Admin");
  const dispatch = useDispatch();

  const { dashboard, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const {
    overview = {},
    orders = {},
    revenue = {},
    inventory = {},
    recentOrders = [],
    recentCustomers = [],
    topProducts = [],
    lowStockProducts = [],
    salesTrend = [],
  } = dashboard || {};

  const customers = overview.customers || {};
  const products = overview.products || {};

  const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formatNumber = (value = 0) => {
    return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
  };

  const chartData = useMemo(() => {
    return (salesTrend || []).map((item) => ({
      label:
        item.label || item.date || item.day || item._id || item.period || "",

      sales: Number(
        item.sales ?? item.revenue ?? item.totalRevenue ?? item.amount ?? 0,
      ),

      orders: Number(
        item.orders ?? item.orderCount ?? item.totalOrders ?? item.count ?? 0,
      ),
    }));
  }, [salesTrend]);

  const orderStatusCards = [
    {
      title: "Pending",
      value: orders.status?.pending || 0,
      icon: Clock3,
      className: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
    },
    {
      title: "Processing",
      value: orders.status?.processing || 0,
      icon: Package,
      className: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
    },
    {
      title: "Shipped",
      value: orders.status?.shipped || 0,
      icon: Truck,
      className: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10",
    },
    {
      title: "Delivered",
      value: orders.status?.delivered || 0,
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
    },
    {
      title: "Cancelled",
      value: orders.status?.cancelled || 0,
      icon: XCircle,
      className: "bg-red-50 text-red-600 dark:bg-red-500/10",
    },
    {
      title: "Returned",
      value: orders.status?.returned || 0,
      icon: RotateCcw,
      className: "bg-purple-50 text-purple-600 dark:bg-purple-500/10",
    },
  ];

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center dark:border-red-900/40 dark:bg-red-950/20">
          <AlertTriangle className="mx-auto mb-2 h-7 w-7 text-red-500" />

          <h3 className="font-semibold text-red-700 dark:text-red-400">
            Failed to load dashboard
          </h3>

          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>

          <button
            onClick={() => dispatch(getDashboard())}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 p-5">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Heading
          heading={"Dashboard Overview"}
          para={"Monitor your store performance and activity."}
        />

        <button
          onClick={() => dispatch(getDashboard())}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-900"
        >
          <TrendingUp className="h-4 w-4" />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          MAIN STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(revenue.total)}
          subtitle={`This month ${formatCurrency(revenue.thisMonth)}`}
          icon={IndianRupee}
          iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        />

        <StatCard
          title="Total Orders"
          value={formatNumber(orders.total)}
          subtitle={`${orders.status?.delivered || 0} delivered`}
          icon={ShoppingBag}
          iconClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        />

        <StatCard
          title="Customers"
          value={formatNumber(customers.total)}
          subtitle={`${customers.active || 0} active`}
          icon={Users}
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        />

        <StatCard
          title="Products"
          value={formatNumber(products.total)}
          subtitle={`${products.published || 0} published`}
          icon={Package}
          iconClass="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
        />
      </div>

      {/* =====================================================
          SECONDARY STATS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStat
          title="Categories"
          value={overview.categories?.total || 0}
          icon={Layers3}
        />

        <MiniStat
          title="Sub Categories"
          value={overview.subCategories?.total || 0}
          icon={Tags}
        />

        <MiniStat
          title="Brands"
          value={overview.brands?.total || 0}
          icon={Boxes}
        />

        <MiniStat
          title="Low Stock"
          value={inventory.lowStockVariants || 0}
          icon={AlertTriangle}
          danger={inventory.lowStockVariants > 0}
        />
      </div>

      {/* =====================================================
          REVENUE + ORDER CHART
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue Chart */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Sales Overview
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Revenue and order performance
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <TrendingUp className="h-3.5 w-3.5" />
              Revenue
            </div>
          </div>

          <div className="h-[310px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6366f1"
                        stopOpacity={0.28}
                      />

                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#9ca3af",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#9ca3af",
                    }}
                    tickFormatter={(value) => `₹${value}`}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value, name) => [
                      name === "sales"
                        ? formatCurrency(value)
                        : formatNumber(value),
                      name === "sales" ? "Revenue" : "Orders",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="No sales data available yet." />
            )}
          </div>
        </div>

        {/* Revenue Summary */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Revenue Summary
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Payment performance
          </p>

          <div className="mt-6 space-y-4">
            <RevenueItem
              icon={IndianRupee}
              title="Total Revenue"
              value={formatCurrency(revenue.total)}
            />

            <RevenueItem
              icon={IndianRupee}
              title="Pending Revenue"
              value={formatCurrency(revenue.pending)}
            />

            <RevenueItem
              icon={CreditCard}
              title="Paid"
              value={formatCurrency(revenue.paid)}
            />

            <RevenueItem
              icon={Banknote}
              title="Today"
              value={formatCurrency(revenue.today)}
            />

            <RevenueItem
              icon={TrendingUp}
              title="This Month"
              value={formatCurrency(revenue.thisMonth)}
            />

            <RevenueItem
              icon={RotateCcw}
              title="Refunded"
              value={formatCurrency(revenue.refunded)}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          ORDER STATUS
      ===================================================== */}

      <div>
        <div className="mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Order Status
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Current order distribution
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {orderStatusCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.className}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(item.value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          INVENTORY + PAYMENT METHOD
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Inventory
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Current stock health
              </p>
            </div>

            <Boxes className="h-5 w-5 text-indigo-500" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <InventoryBox title="Variants" value={inventory.totalVariants} />

            <InventoryBox title="Total Stock" value={inventory.totalStock} />

            <InventoryBox
              title="Out of Stock"
              value={inventory.outOfStockVariants}
              danger
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Payment Methods
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Orders by payment method
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <PaymentBox
              title="Online"
              value={orders.method?.online || 0}
              icon={CreditCard}
            />

            <PaymentBox
              title="Cash on Delivery"
              value={orders.method?.cod || 0}
              icon={Banknote}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Latest customer orders
            </p>
          </div>

          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400 dark:border-gray-800">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.slice(0, 10).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 last:border-0 dark:border-gray-800/60"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        #{order.orderNumber || order._id?.slice(-6)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {getCustomerName(order)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs font-medium capitalize text-gray-600 dark:text-gray-400">
                        {order.paymentMethod || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState text="No recent orders found." />
          )}
        </div>
      </div>

      {/* =====================================================
          TOP PRODUCTS + RECENT CUSTOMERS
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Top Products
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Best performing products
          </p>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {topProducts.length > 0 ? (
            topProducts.slice(0, 5).map((product, index) => (
              <div
                key={product._id || index}
                className="flex items-center gap-3 px-5 py-4"
              >
                {/* Rank */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  #{index + 1}
                </div>

                {/* Product */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {product.productName || "Product"}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {formatNumber(product.totalQuantity || 0)}{" "}
                    {product.totalQuantity === 1 ? "item" : "items"} sold
                  </p>
                </div>

                {/* Sales */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(product.totalSales || 0)}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Total sales
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState text="No product sales available." />
          )}
        </div>
      </div>

      {/* =====================================================
          LOW STOCK
      ===================================================== */}

      {lowStockProducts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/10">
          <div className="flex items-center gap-3 border-b border-amber-200 px-5 py-4 dark:border-amber-900/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Low Stock Alert
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Products that need inventory attention
              </p>
            </div>
          </div>

          <div className="divide-y divide-amber-200/70 dark:divide-amber-900/30">
            {lowStockProducts.slice(0, 5).map((product, index) => (
              <div
                key={product._id || index}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {product.productName ||
                      product.name ||
                      product.basicInfo?.productName ||
                      "Product"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    SKU: {product.sku || "N/A"}
                  </p>
                </div>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  {product.stock ?? product.quantity ?? 0} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ title, value, subtitle, icon: Icon, iconClass }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-indigo-500" />
      </div>

      <div className="mt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

        <h3 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   MINI STAT
============================================================ */

function MiniStat({ title, value, icon: Icon, danger = false }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          danger
            ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {title}
        </p>

        <p className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">
          {Number(value || 0).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   REVENUE ITEM
============================================================ */

function RevenueItem({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-400">
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>

        <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   INVENTORY BOX
============================================================ */

function InventoryBox({ title, value, danger = false }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        danger
          ? "border-red-100 bg-red-50/70 dark:border-red-900/30 dark:bg-red-950/10"
          : "border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50"
      }`}
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>

      <p
        className={`mt-1 text-xl font-bold ${
          danger
            ? "text-red-600 dark:text-red-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {Number(value || 0).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/* ============================================================
   PAYMENT BOX
============================================================ */

function PaymentBox({ title, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-400">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>

        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
          {Number(value || 0).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }) {
  const config = {
    pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    confirmed:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    processing:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",

    shipped:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

    out_for_delivery:
      "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",

    delivered:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    cancelled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",

    returned:
      "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  };

  const className =
    config[status] ||
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${className}`}
    >
      {(status || "unknown").replaceAll("_", " ")}
    </span>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({ text }) {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-gray-400">
      {text}
    </div>
  );
}

/* ============================================================
   CUSTOMER NAME
============================================================ */

function getCustomerName(order) {
  const user = order.user;

  if (!user) {
    return "Guest Customer";
  }

  if (user.firstName) {
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }

  return user.name || user.email || "Customer";
}
