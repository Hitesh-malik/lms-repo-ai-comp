import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

export default function CommonModal({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="min-h-[500px] bg-white text-white p-6 rounded-lg w-full  shadow-xl cursor-default relative overflow-hidden max-h-[90vh]"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
