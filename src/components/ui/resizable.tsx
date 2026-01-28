"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof PanelGroup>) {
  return (
    <PanelGroup
      className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
      {...props}
    />
  );
}

function ResizablePanel({
  className,
  ...props
}: React.ComponentProps<typeof Panel>) {
  return <Panel className={cn(className)} {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <PanelResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center bg-slate-200 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]]:after:left-1/2 [&[data-panel-group-direction=vertical]]:after:translate-x-[-50%]",
        className
      )}
      {...props}
    >
      {withHandle ? (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-slate-200 bg-slate-100">
          <div className="flex h-3 w-0.5 gap-0.5">
            <span className="h-full w-px rounded-px bg-slate-400" />
            <span className="h-full w-px rounded-px bg-slate-400" />
          </div>
        </div>
      ) : null}
    </PanelResizeHandle>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
