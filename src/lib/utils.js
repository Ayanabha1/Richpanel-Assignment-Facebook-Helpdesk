import { toast } from "react-toastify";
import { resetApiHeaders } from "../Api/Axios";

export const showSuccess = (message) => {
  toast.success(message || "Success", {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const showError = (message) => {
  toast.error(message || "Something went wrong", {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
