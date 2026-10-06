"use client";

import React from "react";
import Link from "next/link";

export default function TopNav() {
  return (
    <header className="h-10 bg-[#161e2e] border-b border-[#232f3e] text-white flex items-center justify-between px-4 text-xs select-none sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold tracking-wider text-white hover:text-orange-400 flex items-center gap-1.5">
          <span className="bg-[#ec7211] text-black font-extrabold px-1.5 py-0.5 rounded text-[10px]">AWS</span>
          <span>Route 53</span>
        </Link>
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search for services, features, marketplace products, and docs"
            className="w-96 bg-[#232f3e] text-white placeholder-gray-400 text-xs px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#ec7211]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 text-gray-300">
        <span className="hover:text-white cursor-pointer hidden sm:inline">us-east-1 (N. Virginia)</span>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-white">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>root-account @ aws-demo</span>
        </div>
      </div>
    </header>
  );
}