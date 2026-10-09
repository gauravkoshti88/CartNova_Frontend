import React from "react";

const WebsiteCard = ({ title, children }) => {

    return (
        <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
                {title}
            </h2>

            {children}

        </div>
    );
};

export default WebsiteCard;