import React from 'react'
import { useGetAllDeletedData } from '../../hooks/useGetDeletedData';

const DeletedInfo = ({ pageName }) => {

    const { deletedCategories, deletedSubCategories, deletedBrands, loading } =
        useGetAllDeletedData(pageName);

    const currentData =
        pageName === "Category"
            ? deletedCategories?.category
            : pageName === "Sub-Category"
                ? deletedSubCategories?.subCategory
                : deletedBrands?.productBrand;

    if(!currentData){
        return (
            <div>
                
            </div>
        )
    }
    return (
        <div className="bg-white dark:bg-slate-700 rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/70 dark:bg-slate-800 border-b border-gray-200 text-gray-600 dark:text-gray-200 text-xs font-semibold uppercase tracking-wider">
                            <th className="p-4 text-sm font-semibold text-center">ID</th>
                            <th className="p-4 text-sm font-semibold text-center">{pageName} Name</th>
                            <th className="p-4 text-sm font-semibold text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 text-sm">
                        {currentData.map((data, index) => {
                            const isRowChecked = selectedDataIds.includes(data.id);
                            return (
                                <tr
                                    key={index}
                                    className={`transition-colors ${isRowChecked
                                        ? 'bg-blue-50/40 dark:bg-slate-600 hover:bg-blue-50/60'
                                        : 'hover:bg-gray-50/50 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {/* Checkbox column */}
                                    {/* <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isRowChecked}
                                            onChange={() => handleSelectRow(data.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td> */}

                                    <td className="p-3">
                                        {data._id}
                                    </td>

                                    <td className="p-3">
                                        {data.name}
                                    </td>



                                    {/* Actions */}
                                    <td className="p-4 relative" ref={menuRef}>
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-gray-500 dark:text-white hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="View"
                                                onClick={() => setOpenMenu(openMenu === data._id ? null : data._id)}>
                                                <EllipsisVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between flex-col sm:flex-row gap-4 bg-gray-50/50 dark:bg-slate-900">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Showing <strong className="text-gray-700 dark:text-gray-300">1-{currentData.length}</strong> of <strong className="text-gray-700 dark:text-gray-300">{currentData.length}</strong> products
                </span>
                <div className="flex items-center gap-1.5">
                    <button className="p-2 border border-gray-200 bg-white rounded-lg text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg shadow-sm">1</button>
                    <button className="p-2 border border-gray-200 bg-white rounded-lg text-gray-500 hover:bg-gray-50 transition-all">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeletedInfo
