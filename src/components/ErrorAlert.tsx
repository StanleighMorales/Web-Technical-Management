import { FaPlus } from "react-icons/fa6";

type ErrorAlertProps = {
    message: string
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
    return (
        <div className="fixed top-8 right-4 z-50 slide-down">
            <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="shrink-0">
                    <FaPlus className="font-bold text-lg rotate-45" />
                </div>
                <div className="font-semibold text-lg">{message}</div>
            </div>
        </div>
    );
};
