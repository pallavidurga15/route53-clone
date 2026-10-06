"use client";

import { useState, useEffect } from "react";

interface HostedZone {
  id: string;
  name: string;
  type: string;
  record_count: number;
  comment?: string;
}

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [comment, setComment] = useState("");

  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "https://route53-backend-a85w.onrender.com"
  ).replace(/\/$/, "");

  // Fetch hosted zones on load
  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/hosted-zones`);
      if (!res.ok) throw new Error("Failed to fetch zones");
      const data = await res.json();
      setZones(data);
    } catch (error) {
      console.error("Error fetching hosted zones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  // Create new hosted zone
  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName) return;

    try {
      const res = await fetch(`${API_URL}/hosted-zones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: domainName, comment }),
      });

      if (!res.ok) throw new Error("Failed to create hosted zone");

      setDomainName("");
      setComment("");
      setIsModalOpen(false);
      fetchZones(); // Refresh table
    } catch (error) {
      console.error(error);
      alert("Failed to create hosted zone");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Hosted zones</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#ec7211",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create hosted zone
        </button>
      </header>

      {/* Table */}
      {loading ? (
        <p>Loading hosted zones...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc", backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "10px" }}>Domain name</th>
              <th style={{ padding: "10px" }}>Type</th>
              <th style={{ padding: "10px" }}>Record count</th>
              <th style={{ padding: "10px" }}>Hosted zone ID</th>
              <th style={{ padding: "10px" }}>Comment</th>
            </tr>
          </thead>
          <tbody>
            {zones.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                  No hosted zones found.
                </td>
              </tr>
            ) : (
              zones.map((zone) => (
                <tr key={zone.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{zone.name}</td>
                  <td style={{ padding: "10px" }}>{zone.type}</td>
                  <td style={{ padding: "10px" }}>{zone.record_count}</td>
                  <td style={{ padding: "10px" }}>{zone.id}</td>
                  <td style={{ padding: "10px" }}>{zone.comment || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h3>Create hosted zone</h3>
            <form onSubmit={handleCreateZone}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Domain name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. example.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Comment - optional</label>
                <textarea
                  placeholder="Optional description"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "8px 16px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#ec7211",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
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