const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface HostedZone {
  id: string;
  name: string;
  type: string;
  record_count: number;
  comment?: string;
  created_at: string;
}

export interface DNSRecord {
  id: number;
  zone_id: string;
  name: string;
  type: string;
  value: string;
  ttl: number;
  routing_policy: string;
}

// --- Hosted Zones API ---

export async function fetchHostedZones(search?: string): Promise<HostedZone[]> {
  const url = search 
    ? `${API_BASE_URL}/hosted-zones/?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/hosted-zones/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch hosted zones");
  return res.json();
}

export async function fetchHostedZoneById(id: string): Promise<HostedZone> {
  const res = await fetch(`${API_BASE_URL}/hosted-zones/${id}`);
  if (!res.ok) throw new Error("Failed to fetch hosted zone");
  return res.json();
}

export async function createHostedZone(data: { name: string; type: string; comment?: string }): Promise<HostedZone> {
  const res = await fetch(`${API_BASE_URL}/hosted-zones/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create hosted zone");
  return res.json();
}

export async function deleteHostedZone(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/hosted-zones/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete hosted zone");
}

// --- DNS Records API ---

export async function fetchDNSRecords(zoneId: string, search?: string): Promise<DNSRecord[]> {
  const url = search
    ? `${API_BASE_URL}/records/zone/${zoneId}?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/records/zone/${zoneId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch DNS records");
  return res.json();
}

export async function createDNSRecord(data: {
  zone_id: string;
  name: string;
  type: string;
  value: string;
  ttl: number;
  routing_policy: string;
}): Promise<DNSRecord> {
  const res = await fetch(`${API_BASE_URL}/records/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create DNS record");
  return res.json();
}

export async function deleteDNSRecord(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/records/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete DNS record");
}