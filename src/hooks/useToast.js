import { useEffect } from "react";
import { toast } from "react-hot-toast";

export const useToast = ({
    success,
    message,
    error,
    clearMessage,
    clearError,
}) => {

    useEffect(() => {

        if (success && message) {

            toast.success(message);

            clearMessage();

        }

    }, [
        success,
        message,
        clearMessage,
    ]);

    useEffect(() => {

        if (error) {

            toast.error(error);

            clearError();

        }

    }, [
        error,
        clearError,
    ]);

};