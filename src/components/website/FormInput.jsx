import React from "react";

const FormInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text"
}) => {

    return (

        <div>

            <label className="block text-sm font-medium mb-2">
                {label}
            </label>


            <input

                type={type}

                name={name}

                value={value}

                onChange={onChange}

                placeholder={placeholder}

                className="w-full px-4 py-3 border rounded-xl"

            />

        </div>

    );
};


export default FormInput;