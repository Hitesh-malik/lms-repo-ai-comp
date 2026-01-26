"use client";

import React, { useMemo, useState, useImperativeHandle, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type StepperStep = {
  id: string;
  title?: string;
  content: React.ReactNode;
  canNext?: () => boolean | Promise<boolean>;
  onNext?: () => void | Promise<void>;
  onBack?: () => void | Promise<void>;
};

type StepperProps = {
  steps: StepperStep[];
  initialStep?: number;
  onFinish?: () => void | Promise<void>;
  onStepChange?: (stepIndex: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  stepperNextRef?: React.MutableRefObject<(() => void) | null>; // New prop
};

export default function Stepper({
  steps,
  initialStep = 0,
  onFinish,
  onStepChange,
  prevLabel = "Prev",
  nextLabel = "Next",
  finishLabel = "Finish",
  stepperNextRef,
}: StepperProps) {
  const [active, setActive] = useState(initialStep);
  const [loading, setLoading] = useState(false);

  const totalSteps = steps.length;
  const isFirst = active === 0;
  const isLast = active === totalSteps - 1;

  const current = useMemo(() => steps[active], [steps, active]);

  const goTo = (idx: number) => {
    setActive(idx);
    onStepChange?.(idx);
  };

  const handleBack = async () => {
    if (isFirst || loading) return;

    setLoading(true);
    try {
      await current?.onBack?.();
      goTo(active - 1);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const ok = await current?.canNext?.();
      if (ok === false) {
        setLoading(false);
        return;
      }

      await current?.onNext?.();

      if (isLast) {
        await onFinish?.();
        return;
      }

      goTo(active + 1);
    } finally {
      setLoading(false);
    }
  };

  // Expose handleNext to parent via ref
  useEffect(() => {
    if (stepperNextRef) {
      stepperNextRef.current = handleNext;
    }
  }, [active, loading]); // Re-bind when active or loading changes

  return (
    <div className="w-full p-8">
      {/* top step indicator */}
      <StepsHeader numSteps={totalSteps} activeIndex={active} />

      {/* content area */}
      <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {current.title && (
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                {current.title}
              </h2>
            )}
            {current.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* actions */}
      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleBack}
          disabled={isFirst || loading}
          className="px-4 py-2 rounded hover:bg-slate-100 text-slate-800 disabled:opacity-50"
        >
          {prevLabel}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Please wait..." : isLast ? finishLabel : nextLabel}
        </button>
      </div>
    </div>
  );
}

// StepsHeader and StepCircle components remain the same...

function StepsHeader({
  numSteps,
  activeIndex,
}: {
  numSteps: number;
  activeIndex: number;
}) {
  const stepArray = Array.from({ length: numSteps }, (_, i) => i);

  return (
    <div className="flex items-center justify-between gap-3">
      {stepArray.map((idx) => {
        const stepNum = idx + 1;
        const isDone = idx < activeIndex;
        const isActive = idx === activeIndex;

        return (
          <React.Fragment key={idx}>
            <StepCircle num={stepNum} isDone={isDone} isActive={isActive} />
            {idx !== stepArray.length - 1 && (
              <div className="w-full h-1 rounded-full bg-slate-200 relative">
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full"
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ ease: "easeIn", duration: 0.25 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepCircle({
  num,
  isDone,
  isActive,
}: {
  num: number;
  isDone: boolean;
  isActive: boolean;
}) {
  const styles = isDone
    ? "border-indigo-600 bg-indigo-600 text-white"
    : isActive
    ? "border-indigo-600 bg-white text-indigo-600"
    : "border-slate-300 bg-white text-slate-400";

  return (
    <div className="relative">
      <div
        className={`w-10 h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-sm relative z-10 transition-colors ${styles}`}
      >
        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.span
              key="done"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              ✓
            </motion.span>
          ) : (
            <motion.span
              key="num"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {num}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {isActive && (
        <div className="absolute z-0 -inset-1.5 bg-indigo-100 rounded-full animate-pulse" />
      )}
    </div>
  );
}
