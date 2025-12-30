import { toast } from "react-toastify";

/**
 * Centralized error handler for API calls
 * @param {Error} error - The error object from the API call
 * @param {string} defaultMessage - Default message to show if error details are unavailable
 * @param {boolean} showToast - Whether to show a toast notification (default: true)
 */
export const handleApiError = (
  error,
  defaultMessage = "An error occurred",
  showToast = true
) => {
  // Extract error message from response
  const message =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage;

  // Log error for debugging
  console.error(`API Error: ${defaultMessage}`, {
    message,
    status: error?.response?.status,
    data: error?.response?.data,
    error,
  });

  // Show toast notification
  if (showToast) {
    toast.error(message);
  }

  return message;
};

/**
 * Handle network errors specifically
 * @param {Error} error - The error object
 */
export const handleNetworkError = (error) => {
  if (!error.response) {
    // Network error or server is down
    const message =
      "Unable to connect to server. Please check your internet connection.";
    console.error("Network Error:", error);
    toast.error(message);
    return message;
  }
  return handleApiError(error);
};

/**
 * Create error handler with context
 * @param {string} context - Context description for logging
 * @returns {Function} Error handler function
 */
export const createErrorHandler = (context) => {
  return (error, defaultMessage) => {
    console.error(`[${context}]`, error);
    return handleApiError(error, defaultMessage || `Error in ${context}`);
  };
};
