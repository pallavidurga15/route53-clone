"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchHostedZones, createHostedZone, deleteHostedZone, HostedZone } from "@/lib/api";

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Form states
  const [domainName, setDomainName] = useState("");
  const [comment, setComment] = useState("");

  const loadZones = async () => {
    try {
      const data = await fetchHostedZones(search);
      setZones(data);
    } catch (err) {
      console.error("Failed to load zones:", err);
    }
  };

  useEffect(() => {
    loadZones();
  }, [search]);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName) return;
    try {
      await createHostedZone({ name: domainName, type: "Public hosted zone", comment });
      setDomainName("");
      setComment("");
      setIsModalOpen(false);
      loadZones();
    } catch (err) {
      alert("Failed to create hosted zone");
    }
  };

  const handleDeleteZone = async () => {
    if (!selectedZoneId) return;
    if (confirm("Are you sure you want to delete this hosted zone?")) {
      try {
        await deleteHostedZone(selectedZoneId);
        setSelectedZoneId(null);
        loadZones();
      } catch (err) {
        alert("Failed to delete zone");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hosted zones</h1>
          <p className="text-xs text-gray-500 mt-1">
            A hosted zone is a container for DNS records that define how you want to route traffic on the internet for a domain.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteZone}
            disabled={!selectedZoneId}
            className={`px-3 py-1.5 text-xs font-semibold rounded border ${
              selectedZoneId
                ? "border-red-600 text-red-600 hover:bg-red-50 cursor-pointer"
                : "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
            }`}
          >
            Delete
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ec7211] hover:bg-[#eb5f07] text-white px-4 py-1.5 text-xs font-semibold rounded shadow-sm"
          >
            Create hosted zone
          </button>
        </div>
      </div>

      {/* Table Controls & Search */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search hosted zones by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 text-xs border border-gray-300 px-3 py-1.5 rounded focus:outline-none focus:border-[#0972d3]"
          />
          <span className="text-xs text-gray-500">Total: {zones.length}</span>
        </div>

        {/* Table */}
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-semibold">
              <th className="p-3 w-8"></th>
              <th className="p-3">Domain name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Record count</th>
              <th className="p-3">Hosted zone ID</th>
              <th className="p-3">Comment</th>
            </tr>
          </thead>
          <tbody>
            {zones.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No hosted zones found.
                </td>
              </tr>
            ) : (
              zones.map((zone) => (
                <tr
                  key={zone.id}
                  className={`border-b border-gray-200 hover:bg-blue-50 ${
                    selectedZoneId === zone.id ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="radio"
                      name="zone-select"
                      checked={selectedZoneId === zone.id}
                      onChange={() => setSelectedZoneId(zone.id)}
                    />
                  </td>
                  <td className="p-3 font-semibold text-[#0972d3] hover:underline">
                    <Link href={`/hostedzones/${zone.id}`}>{zone.name}</Link>
                  </td>
                  <td className="p-3">{zone.type}</td>
                  <td className="p-3">{zone.record_count}</td>
                  <td className="p-3 font-mono text-gray-600">{zone.id}</td>
                  <td className="p-3 text-gray-500">{zone.comment || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Hosted Zone */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">Create hosted zone</h2>
            <form onSubmit={handleCreateZone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Domain name</label>
                <input
                  type="text"
                  required
                  placeholder="example.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="w-full text-xs border border-gray-300 p-2 rounded focus:border-[#0972d3] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Comment - optional</label>
                <textarea
                  rows={3}
                  placeholder="Optional description"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs border border-gray-300 p-2 rounded focus:border-[#0972d3] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ec7211] hover:bg-[#eb5f07] text-white px-4 py-1.5 text-xs font-semibold rounded"
                >
                  Create hosted zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}