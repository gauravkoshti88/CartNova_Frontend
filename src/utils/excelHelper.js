import * as XLSX from "xlsx";

export const productExportToExcel = (
  tableData,
  fileName = "Product_Inventrory_G_Shop",
) => {
  const cleanedData = tableData.map((item) => ({
    "Product Name": item.name,
    "SKU Code": item.sku,
    Category: item.category,
    "Sub-Category": item.subcategory,
    "Price (INR)": item.price,
    "Current Stock": item.stock,
    "Publish Status": item.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products List");

  XLSX.writeFile(
    workbook,
    `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};

export const categoryExportToExcel = (
  tableData,
  fileName = "Category_G_Shop",
) => {
  const cleanedData = tableData.map((item) => ({
    "Category Name": item.name,
    "Category ID": item.categoryId,
    Description: item.description,
    Status: item.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Category List");

  XLSX.writeFile(
    workbook,
    `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};

export const subcategoryExportToExcel = (
  tableData,
  fileName = "Sub_Category_G_Shop",
) => {
  const cleanedData = tableData.map((item) => ({
    "Sub-Category Name": item.name,
    "Sub-Category ID": item.subcategoryId,
    Category: item.category,
    Description: item.description,
    Status: item.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sub Category List");

  XLSX.writeFile(
    workbook,
    `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};

export const childCategoryExportToExcel = (
  tableData,
  fileName = "Child_Category_G_Shop",
) => {
  const cleanedData = tableData.map((item) => ({
    "Child-Category Name": item.name,
    "Child-Category ID": item.childCategoryId,
    "Sub-Category": item.subCategory,
    Description: item.description,
    Status: item.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanedData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Child Category List");

  XLSX.writeFile(
    workbook,
    `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};

export const brandExportToExcel = (tableData, fileName = "Brand_G_Shop") => {
  const cleanedData = tableData.map((item) => ({
    "Brand Name": item.name,
    "Brand ID": item.brandId,
    Category: item.category,
    Subcategory: item.subcategory,
    Description: item.description,
    Status: item.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Brand List");

  XLSX.writeFile(
    workbook,
    `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};

export const customersExportToExcel = (
  tableData,
  fileName = "Customers_G_Shop",
) => {
  const cleanedData = tableData.map((item) => ({
    "Customer Name": item.customerName,
    Email: item.email,
    "Customer ID": item.customerId,
    "Total Orders": item.totalOrders,
    "Total Spant": item.totalSpant,
    Status: item.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers List");

  XLSX.writeFile(
    workbook,
    `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};
