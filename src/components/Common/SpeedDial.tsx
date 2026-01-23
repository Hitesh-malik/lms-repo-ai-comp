"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, BookOpen, Users, Settings } from "lucide-react";

export default function SpeedDial() {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: BookOpen, label: "Add Course" },
    { icon: Users, label: "Add Student" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 bg-white shadow-md border rounded-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <action.icon size={16} />
              {action.label}
            </motion.button>
          ))}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
      >
        <Plus className={open ? "rotate-45 transition" : "transition"} />
      </button>
    </div>
  );
}
