import React from "react";

const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    placeholder
}) => {

    return (

        <div>

            <label className="block text-sm font-medium mb-2">
                {label}
            </label>


            <textarea

                name={name}

                value={value}

                onChange={onChange}

                placeholder={placeholder}

                rows={5}

                className="w-full px-4 py-3 border rounded-xl"

            />

        </div>

    );
};


export default FormTextarea;