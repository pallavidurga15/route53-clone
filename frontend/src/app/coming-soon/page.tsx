import React from "react";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-gray-200 rounded p-8 text-center shadow-sm">
      <span className="bg-orange-100 text-[#ec7211] text-xs font-bold px-3 py-1 rounded-full mb-3">
        AWS Route53 Placeholder
      </span>
      <h1 className="text-2xl font-bold text-gray-800">Feature Coming Soon</h1>
      <p className="text-xs text-gray-500 mt-2 max-w-sm">
        This section is currently mocked out per assignment requirements. Hosted Zone management and DNS Record set workflows are fully implemented.
      </p>
      <Link
        href="/hostedzones"
        className="mt-6 bg-[#ec7211] text-white px-4 py-2 rounded text-xs font-semibold hover:bg-[#eb5f07]"
      >
        Go to Hosted Zones
      </Link>
    </div>
  );
}