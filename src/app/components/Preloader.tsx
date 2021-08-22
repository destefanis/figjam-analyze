import * as React from "react";
import { motion } from "framer-motion";

function Preloader() {
  const loading = (
    <div className="preloader">
      <motion.div
        className="preloader-row"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <motion.div
          className="preloader-circle"
          initial={{ scale: 0.8, y: 0, opacity: 1 }}
          animate={{ scale: 1.2, y: 0, opacity: 0.6 }}
          style={{ originX: 0.5, originY: 0.5 }}
          transition={{
            repeatType: "reverse",
            repeat: Infinity,
            type: "tween",
            duration: 0.28,
            delay: 0,
            repeatDelay: 0.14,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="preloader-circle"
          initial={{ scale: 0.8, y: 0, opacity: 1 }}
          animate={{ scale: 1.2, y: 0, opacity: 0.6 }}
          style={{ originX: 0.5, originY: 0.5 }}
          transition={{
            repeatType: "reverse",
            repeat: Infinity,
            type: "tween",
            duration: 0.28,
            delay: 0.14,
            repeatDelay: 0.14,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="preloader-circle"
          initial={{ scale: 0.8, y: 0, opacity: 1 }}
          animate={{ scale: 1.2, y: 0, opacity: 0.6 }}
          style={{ originX: 0.5, originY: 0.5 }}
          transition={{
            repeatType: "reverse",
            repeat: Infinity,
            type: "tween",
            duration: 0.28,
            delay: 0.28,
            repeatDelay: 0.14,
            ease: "easeInOut"
          }}
        ></motion.div>
        <h3 className="type type--pos-large-medium preloader-title">
          Summarizing...
        </h3>
      </motion.div>
    </div>
  );

  return <React.Fragment>{loading}</React.Fragment>;
}

export default Preloader;
