"use client";

import React, { Dispatch, ReactNode, SetStateAction } from "react";
import useMeasure from "react-use-measure";
import {
  motion,
  useAnimate,
  useDragControls,
  useMotionValue,
} from "motion/react";
import { FaS } from "react-icons/fa6";

type DrawerSide = "right" | "left" | "bottom";

interface DrawerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;

  side?: DrawerSide;          // default: "right"
  closeOnOverlayClick?: boolean; // default: true
  dragToClose?: boolean;      // default: true
  dragCloseThreshold?: number; // default: 120px
  widthClassName?: string;    // default: "w-[380px]"
}

export function CommonDrawer({
  open,
  setOpen,
  children,
  side = "right",
  closeOnOverlayClick = true,
  dragToClose = false,
  dragCloseThreshold = 120,
  widthClassName = "w-[380px]",
}: DrawerProps) {
  const [scope, animate] = useAnimate();
  const [panelRef, bounds] = useMeasure();

  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const isRight = side === "right";
  const isLeft = side === "left";
  const isBottom = side === "bottom";

  const axis = isBottom ? "y" : "x";

  const handleClose = async () => {
    // fade overlay
    animate(scope.current, { opacity: [1, 0] });

    // slide panel out
    if (isBottom) {
      const h = bounds.height || 0;
      const yStart = typeof y.get() === "number" ? y.get() : 0;
      await animate("#drawer-panel", { y: [yStart, h] });
    } else {
      const w = bounds.width || 0;
      const xStart = typeof x.get() === "number" ? x.get() : 0;

      // right drawer goes to +width, left drawer goes to -width
      const target = isRight ? w : -w;
      await animate("#drawer-panel", { x: [xStart, target] });
    }

    setOpen(false);
    x.set(0);
    y.set(0);
  };

  // where panel starts from when opening
  const initialPos = isBottom
    ? { y: "100%" }
    : isRight
    ? { x: "100%" }
    : { x: "-100%" };

  // where it animates to when open
  const animatePos = isBottom ? { y: "0%" } : { x: "0%" };

  // panel positioning classes
  const panelPosition =
    side === "bottom"
      ? "bottom-0 left-0 right-0 h-[75vh] rounded-t-3xl"
      : side === "right"
      ? "top-0 right-0 h-full rounded-l-3xl"
      : "top-0 left-0 h-full rounded-r-3xl";

  // drag direction constraints
  const dragConstraints = isBottom
    ? { top: 0, bottom: 0 }
    : { left: 0, right: 0 };

  // handle close based on drag amount
  const onDragEnd = () => {
    if (!dragToClose) return;

    if (isBottom) {
      if (y.get() >= dragCloseThreshold) handleClose();
      else animate("#drawer-panel", { y: 0 });
    } else if (isRight) {
      // right drawer: drag to +X to close
      if (x.get() >= dragCloseThreshold) handleClose();
      else animate("#drawer-panel", { x: 0 });
    } else {
      // left drawer: drag to -X to close
      if (x.get() <= -dragCloseThreshold) handleClose();
      else animate("#drawer-panel", { x: 0 });
    }
  };

  if (!open) return null;

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/60"
      onClick={() => closeOnOverlayClick && handleClose()}
    >
      <motion.div
        id="drawer-panel"
        ref={panelRef}
        initial={initialPos as any}
        animate={animatePos as any}
        transition={{ ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        className={[
          "absolute bg-neutral-900 shadow-xl overflow-hidden",
          panelPosition,
          isBottom ? "w-full" : widthClassName,
        ].join(" ")}
        style={isBottom ? { y } : { x }}
        drag={dragToClose ? axis : false}
        dragControls={controls}
        dragListener={false}
        dragConstraints={dragConstraints}
        dragElastic={isBottom ? { top: 0, bottom: 0.5 } : 0.2}
        onDragEnd={onDragEnd}
      >
        {/* Drag handle */}
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center bg-neutral-900 p-4">
          <button
            onPointerDown={(e) => controls.start(e)}
            className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
            aria-label="Drag to close"
          />
        </div>

        <div className="h-full overflow-y-auto p-4 pt-12">{children}</div>
      </motion.div>
    </motion.div>
  );
}
