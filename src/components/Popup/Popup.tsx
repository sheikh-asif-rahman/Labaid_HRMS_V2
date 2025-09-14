import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Popup.css";

type PopupProps = {
  isOpen: boolean;
  type?: "loading" | "done" | "notdone";
  message?: string;
  onClose?: () => void;
};

const Popup: React.FC<PopupProps> = ({ isOpen, type = "loading", message = "", onClose }) => {
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
            className={`wc-popup-container ${type === "loading" ? "wc-popup-loading" : "wc-popup-status"}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {type === "loading" && (
              <>
                <div className="wc-popup-loader" aria-hidden="true"></div>
                <p className="wc-popup-loading-text">LOADING...</p>
              </>
            )}

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
                  <i className="bi bi-check-circle wc-popup-status-icon wc-popup-done" aria-hidden="true"></i>
                ) : (
                  <i className="bi bi-x-circle-fill wc-popup-status-icon wc-popup-notdone" aria-hidden="true"></i>
                )}
                <p className="wc-popup-status-text">
                  {message || (type === "done" ? "Operation Successful" : "Operation Failed")}
                </p>
                <button className="wc-popup-ok-button" onClick={onClose}>
                  OK
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
