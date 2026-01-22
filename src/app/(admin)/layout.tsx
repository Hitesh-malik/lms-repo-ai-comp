"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconChartLine,
  IconChevronRight,
  IconDashboard,
  IconSettings,
  IconUserShield,
  IconUserPlus,
  IconBook,
  IconLogout,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutApi } from "@/services/authApi";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "User Dashboard",
      href: "#",
      icon: (
        <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Sub Admin dashboard",
      href: "/addUser",
      icon: (
        <IconUserPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }, 
    {
      label: "Role & Permission",
      href: "/rolePermission",
      icon: (
        <IconUserShield className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Analysis",
      href: "/profile",
      icon: (
        <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }, 
    {
      label: "Course Management",
      href: "/courseManagement",
      icon: (
        <IconBook className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },   
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full  flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <PlatformMenu />
            </div>
          </div>
          <div>

            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};


function PlatformMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Parent Item */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md  py-2 text-left text-sm text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <div className="flex items-center gap-2">
          <IconSettings className="h-5 w-5" />
          <span>Playground</span>
        </div>

        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IconChevronRight className="h-5 w-5" />
        </motion.span>
      </button>

      {/* Sub Menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="ml-6 mt-2 flex flex-col gap-1 border-l border-neutral-300 pl-3 dark:border-neutral-700"
        >
          <a className="rounded px-2 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
            History
          </a>
          <a className="rounded px-2 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
            Starred
          </a>
          <a className="rounded px-2 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
            Settings
          </a>
        </motion.div>
      )}
    </div>
  );
}
