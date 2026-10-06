"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/coming-soon" },
    { label: "Hosted zones", href: "/hostedzones" },
    { label: "Traffic policies", href: "/coming-soon" },
    { label: "Health checks", href: "/coming-soon" },
    { label: "Resolver", href: "/coming-soon" },
    { label: "Profiles", href: "/coming-soon" },
  ];

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-2.5rem)] text-xs text-gray-800 flex-shrink-0">
      <div className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
        Route 53
      </div>
      <nav className="py-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && item.href !== "/coming-soon";
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`block px-4 py-2 hover:bg-gray-100 font-medium ${
                isActive
                  ? "border-l-4 border-[#ec7211] bg-orange-50 font-semibold text-[#161e2e]"
                  : "text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}