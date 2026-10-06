# AWS Route 53 Console Clone

A full-stack web application replicating the core workflows of the AWS Route 53 management console. Built with Next.js and FastAPI, it provides persistent DNS zone and record management backed by an SQLite database.

---

## 🛠 Tech Stack

- **Frontend:** Next.js (TypeScript, App Router), Tailwind CSS
- **Backend:** FastAPI (Python 3.11+), SQLAlchemy ORM, Pydantic
- **Database:** SQLite (`route53.db`)

---

## 🏗 System Architecture

```text
SCALER/
├── backend/                  # FastAPI Backend API
│   ├── app/
│   │   ├── main.py           # Application Entry Point & Middleware
│   │   ├── database.py       # SQLite Connection & Session Manager
│   │   ├── models.py         # SQLAlchemy Database Models
│   │   ├── schemas.py        # Pydantic Schemas
│   │   └── crud.py           # Database Operations Logic
│   └── route53.db            # Persistent SQLite Database
│
└── frontend/                 # Next.js Frontend UI
    └── src/
        ├── app/              # Next.js App Router Pages
        │   ├── hostedzones/  # Hosted Zone & Record Management Views
        │   └── coming-soon/  # Feature Placeholders
        ├── components/       # AWS Cloudscape Layout Components
        └── lib/
            └── api.ts        # Fetch API Integration

Quick Start Guide
Prerequisites
Node.js (v18+)

Python (3.11+)

1. Backend Setup (FastAPI)
cd backend
(WINDOWS)
python -m venv venv
.\venv\Scripts\Activate.ps1
(macOS / Linux / Git Bash)
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
API Server: http://localhost:8000

Interactive API Docs (Swagger UI): http://localhost:8000/docs

2. Frontend Setup (Next.js)
cd frontend
npm install
npm run dev

## 🗄 Database Schema

### `hosted_zones` Table

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | Route 53 Zone ID (e.g., `Z0123456789ABC`) |
| `name` | String | Not Null | Domain name (e.g., `example.com`) |
| `type` | Enum | Default: `Public hosted zone` | `Public hosted zone` or `Private hosted zone` |
| `record_count` | Integer | Default: `2` | Total count of associated DNS records |
| `comment` | String | Optional | Zone description or notes |
| `created_at` | DateTime | Auto-generated | Creation timestamp |

---

### `dns_records` Table

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto-inc | Unique Record Identifier |
| `zone_id` | String | Foreign Key | Foreign key to `hosted_zones.id` (`ON DELETE CASCADE`) |
| `name` | String | Not Null | Subdomain or domain name |
| `type` | Enum | Not Null | DNS Type (`A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `SOA`, etc.) |
| `value` | String | Not Null | Target IP or destination (multi-line supported) |
| `ttl` | Integer | Default: `300` | Time To Live in seconds |
| `routing_policy` | String | Default: `Simple` | Routing policy strategy |

---

## 🔌 REST API Specifications

### Hosted Zone Endpoints (`/api/hosted-zones`)

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/hosted-zones/` | Fetch all hosted zones (Optional query filter: `?search=`) |
| `POST` | `/api/hosted-zones/` | Create a new hosted zone (Auto-creates default NS and SOA records) |
| `GET` | `/api/hosted-zones/{zone_id}` | Retrieve details for a specific hosted zone |
| `PUT` | `/api/hosted-zones/{zone_id}` | Update zone metadata |
| `DELETE` | `/api/hosted-zones/{zone_id}` | Delete a hosted zone and all associated DNS records |

---

### DNS Record Endpoints (`/api/records`)

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/records/zone/{zone_id}` | Fetch all DNS records inside a specific zone (Optional filter: `?search=`) |
| `POST` | `/api/records/` | Create a new DNS record in a hosted zone |
| `DELETE` | `/api/records/{record_id}` | Delete a DNS record by ID |