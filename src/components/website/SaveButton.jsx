import React from "react";
import { Save } from "lucide-react";


const SaveButton = ({ loading }) => {

    return (

        <button

            disabled={loading}

            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 cursor-pointer text-white px-6 py-3 rounded-xl disabled:opacity-50 font-semibold"

        >

            <Save size={18}/>

            {
                loading
                ? "Saving..."
                : "Save Changes"
            }


        </button>

    );

};


export default SaveButton;