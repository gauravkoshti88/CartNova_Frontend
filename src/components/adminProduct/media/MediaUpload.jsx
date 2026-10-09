import { UploadCloud } from "lucide-react";

export default function MediaUpload({
    onUpload,
    multiple = true,
    accept = "image/*"
}) {

    const handleChange = (e) => {

        const files = Array.from(e.target.files);

        if (!files.length) return;

        onUpload(files);

        e.target.value = "";
    };

    return (

        <label className="group border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl h-52 flex flex-col justify-center items-center cursor-pointer transition">

            <UploadCloud
                size={50}
                className="text-gray-400 group-hover:text-blue-500"
            />

            <h3 className="mt-4 font-semibold">

                Upload Images

            </h3>

            <p className="text-sm text-gray-500">

                PNG, JPG, WEBP

            </p>

            <input

                hidden

                name="image"

                type="file"

                multiple={multiple}

                accept={accept}

                onChange={handleChange}

            />

        </label>

    );

}