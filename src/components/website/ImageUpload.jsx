import React from "react";
import { Upload } from "lucide-react";


const ImageUpload = ({
    label,
    name,
    preview,
    onChange
}) => {


    return (

        <div>

            <label className="block text-sm font-medium mb-2">
                {label}
            </label>


            <div className="flex items-center gap-4">


                {
                    preview && (

                        <img

                            src={preview}

                            alt={name}

                            className="w-24 h-24 object-contain rounded-xl border"

                        />

                    )
                }



                <label className="cursor-pointer border rounded-xl px-4 py-3 flex items-center gap-2">


                    <Upload size={18}/>

                    Upload


                    <input

                        hidden

                        type="file"

                        name={name}

                        accept="image/*"

                        onChange={onChange}

                    />


                </label>


            </div>


        </div>

    );

};


export default ImageUpload;