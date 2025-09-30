import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Popup.css";
import underdevGif from "../../assets/underdev.gif"; // adjust path
import axios from "axios";

type PopupProps = {
  isOpen: boolean;
  type?: "loading" | "done" | "notdone" | "underdev" | "changePassword";
  message?: string;
  onClose?: () => void;
  employeeId?: string;
};

const Popup: React.FC<PopupProps> = ({
  isOpen,
  type = "loading",
  message = "",
  onClose,
  employeeId,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"done" | "notdone" | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setStatus("notdone");
      setStatusMessage("Please fill both fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/api/changePassword", {
        EmployeeId: employeeId,
        oldPassword,
        newPassword,
      });

      setStatus("done");
      setStatusMessage(res.data.message || "Password updated successfully");
    } catch (error: any) {
      setStatus("notdone");
      setStatusMessage(
        error?.response?.data?.message || "Password change failed"
      );
    } finally {
      setLoading(false);
      setOldPassword("");
      setNewPassword("");
    }
  };

  const closePopup = () => {
    setStatus(null);
    setStatusMessage("");
    onClose && onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="wc-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`wc-popup-container ${
              type === "loading" ? "wc-popup-loading" : "wc-popup-status"
            } ${type === "underdev" ? "wc-popup-underdev" : ""}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Existing Loading */}
            {type === "loading" && (
              <>
                <div className="wc-popup-loader" aria-hidden="true"></div>
                <p className="wc-popup-loading-text">LOADING...</p>
              </>
            )}

            {/* Done / Not Done */}
            {(type === "done" || type === "notdone") && (
              <motion.div
                className="wc-popup-status-content"
                role="status"
                aria-live="polite"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {type === "done" ? (
                  <i
                    className="bi bi-check-circle wc-popup-status-icon wc-popup-done"
                    aria-hidden="true"
                  ></i>
                ) : (
                  <i
                    className="bi bi-x-circle-fill wc-popup-status-icon wc-popup-notdone"
                    aria-hidden="true"
                  ></i>
                )}
                <p className="wc-popup-status-text">
                  {message ||
                    (type === "done"
                      ? "Operation Successful"
                      : "Operation Failed")}
                </p>
                <button className="wc-popup-ok-button" onClick={onClose}>
                  OK
                </button>
              </motion.div>
            )}

            {/* Under Development */}
            {type === "underdev" && (
              <motion.div
                className="wc-popup-status-content"
                role="status"
                aria-live="polite"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <img
                  src={underdevGif}
                  alt="Under Development"
                  className="wc-popup-underdev-gif"
                />
                <p className="wc-popup-underdev-text">Under Development!</p>
              </motion.div>
            )}

            {/* Change Password */}
            {type === "changePassword" && (
              <motion.div
                className="wc-popup-status-content"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <h3>Change Password</h3>

                {status ? (
                  <>
                    <i
                      className={`bi ${
                        status === "done"
                          ? "bi-check-circle wc-popup-status-icon wc-popup-done"
                          : "bi-x-circle-fill wc-popup-status-icon wc-popup-notdone"
                      }`}
                      aria-hidden="true"
                    ></i>
                    <p>{statusMessage}</p>
                    <button className="wc-popup-ok-button" onClick={closePopup}>
                      OK
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      className="wc-popup-ok-button"
                      onClick={handlePasswordChange}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
