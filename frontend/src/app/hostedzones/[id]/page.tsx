"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  fetchHostedZoneById,
  fetchDNSRecords,
  createDNSRecord,
  deleteDNSRecord,
  HostedZone,
  DNSRecord,
} from "@/lib/api";

export default function HostedZoneDetailPage() {
  const params = useParams();
  const zoneId = params.id as string;

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  // Form states
  const [recordName, setRecordName] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [recordValue, setRecordValue] = useState("");
  const [ttl, setTtl] = useState(300);

  const loadZoneAndRecords = async () => {
    try {
      const zoneData = await fetchHostedZoneById(zoneId);
      setZone(zoneData);
      const recordsData = await fetchDNSRecords(zoneId, search);
      setRecords(recordsData);
    } catch (err) {
      console.error("Failed to load zone records:", err);
    }
  };

  useEffect(() => {
    if (zoneId) {
      loadZoneAndRecords();
    }
  }, [zoneId, search]);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordValue) return;

    // Standardize record domain name
    const fullName = recordName
      ? recordName.endsWith(zone?.name || "")
        ? recordName
        : `${recordName}.${zone?.name}`
      : zone?.name || "";

    try {
      await createDNSRecord({
        zone_id: zoneId,
        name: fullName,
        type: recordType,
        value: recordValue,
        ttl: Number(ttl),
        routing_policy: "Simple",
      });

      // Reset form
      setRecordName("");
      setRecordType("A");
      setRecordValue("");
      setTtl(300);
      setIsModalOpen(false);
      loadZoneAndRecords();
    } catch (err) {
      alert("Failed to create DNS record");
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecordId) return;
    if (confirm("Are you sure you want to delete this DNS record?")) {
      try {
        await deleteDNSRecord(selectedRecordId);
        setSelectedRecordId(null);
        loadZoneAndRecords();
      } catch (err) {
        alert("Failed to delete DNS record");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="text-xs text-gray-500">
        <Link href="/hostedzones" className="text-[#0972d3] hover:underline">
          Hosted zones
        </Link>{" "}
        &gt; <span className="text-gray-800 font-semibold">{zone?.name || zoneId}</span>
      </div>

      {/* Zone Overview Banner */}
      <div className="bg-white p-4 border border-gray-200 rounded shadow-sm flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{zone?.name}</h1>
          <div className="mt-2 text-xs grid grid-cols-3 gap-x-8 gap-y-1 text-gray-600">
            <div><span className="font-semibold text-gray-800">Zone ID:</span> {zone?.id}</div>
            <div><span className="font-semibold text-gray-800">Type:</span> {zone?.type}</div>
            <div><span className="font-semibold text-gray-800">Total records:</span> {records.length}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDeleteRecord}
            disabled={!selectedRecordId}
            className={`px-3 py-1.5 text-xs font-semibold rounded border ${
              selectedRecordId
                ? "border-red-600 text-red-600 hover:bg-red-50 cursor-pointer"
                : "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
            }`}
          >
            Delete record
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ec7211] hover:bg-[#eb5f07] text-white px-4 py-1.5 text-xs font-semibold rounded shadow-sm"
          >
            Create record
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search records by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 text-xs border border-gray-300 px-3 py-1.5 rounded focus:outline-none focus:border-[#0972d3]"
          />
          <span className="text-xs text-gray-500">Records count: {records.length}</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-semibold">
              <th className="p-3 w-8"></th>
              <th className="p-3">Record name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Routing policy</th>
              <th className="p-3">TTL (seconds)</th>
              <th className="p-3">Value / Route traffic to</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No records found in this hosted zone.
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr
                  key={rec.id}
                  className={`border-b border-gray-200 hover:bg-blue-50 ${
                    selectedRecordId === rec.id ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="radio"
                      name="record-select"
                      checked={selectedRecordId === rec.id}
                      onChange={() => setSelectedRecordId(rec.id)}
                    />
                  </td>
                  <td className="p-3 font-semibold text-gray-900">{rec.name}</td>
                  <td className="p-3 font-mono font-bold text-[#0972d3]">{rec.type}</td>
                  <td className="p-3">{rec.routing_policy}</td>
                  <td className="p-3">{rec.ttl}</td>
                  <td className="p-3 font-mono text-gray-700 whitespace-pre-line">{rec.value}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Record */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">Create record</h2>
            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Record name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="subdomain (e.g. api)"
                    value={recordName}
                    onChange={(e) => setRecordName(e.target.value)}
                    className="flex-1 text-xs border border-gray-300 p-2 rounded focus:border-[#0972d3] outline-none"
                  />
                  <span className="text-xs text-gray-500 font-mono">.{zone?.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Record type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="w-full text-xs border border-gray-300 p-2 rounded focus:border-[#0972d3] outline-none bg-white"
                >
                  <option value="A">A - Routes traffic to an IPv4 address</option>
                  <option value="AAAA">AAAA - Routes traffic to an IPv6 address</option>
                  <option value="CNAME">CNAME - Routes traffic to another domain name</option>
                  <option value="TXT">TXT - Text record for verification</option>
                  <option value="MX">MX - Mail server endpoint</option>
                  <option value="NS">NS - Name server for the zone</option>
                  <option value="PTR">PTR - Pointer record</option>
                  <option value="SRV">SRV - Service locator</option>
                  <option value="CAA">CAA - Certification Authority Authorization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Value / Route traffic to</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. 192.0.2.1 (One value per line)"
                  value={recordValue}
                  onChange={(e) => setRecordValue(e.target.value)}
                  className="w-full text-xs font-mono border border-gray-300 p-2 rounded focus:border-[#0972d3] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">TTL (Seconds)</label>
                <input
                  type="number"
                  value={ttl}
                  onChange={(e) => setTtl(Number(e.target.value))}
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
                  Create record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}