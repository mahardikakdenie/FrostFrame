# 📋 BACKEND ENGINEERING TASKS: Web Builder (Microservices)

## 🚨 ATURAN MAIN & ENVIRONMENT LOKAL (WAJIB DIBACA)
1. **Zero Assumptions:** Jika ada endpoint, payload, atau struktur database yang tidak jelas di tiket ini, **JANGAN BERASUMSI**. Tanyakan kepada Tech Lead / System Analyst terlebih dahulu.
2. **Aturan Infrastruktur (Strict):** 
   * Semua infrastruktur pendukung (**PostgreSQL, Redis, RabbitMQ, MinIO/S3 local**) **WAJIB** dijalankan menggunakan Docker Compose.
   * Aplikasi Backend (Microservices) **TIDAK BOLEH** di-dockerize selama masa development. Dev harus bisa menjalankan service secara native (misal: `npm run start:dev` atau `go run main.go`) untuk memudahkan *debugging* dan *hot-reload*.
3. **Tech Stack Base (Disepakati):** Node.js (NestJS/Express) atau Golang. Komunikasi antar service menggunakan REST API (untuk sinkron) dan RabbitMQ (untuk asinkron).
4. **Format Response Standard:** Semua API harus mereturn format seragam:
   ```json
   { "status": "success|error", "message": "...", "data": {} }
   ```

---

## 🏗️ PHASE 0: INFRASTRUCTURE SETUP
*Ditugaskan kepada: DevOps / Lead BE*

**Task 0.1: Buat file `docker-compose.infra.yml`**
*   **Deskripsi:** Buat file docker-compose yang memuat semua infrastruktur database dan broker. App Backend akan menembak ke `localhost`.
*   **Spesifikasi Services:**
    1.  **PostgreSQL (v15+)**: Port `5432:5432`. Buat database: `builder_auth`, `builder_workspace`, `builder_media`.
    2.  **RabbitMQ (v3-management)**: Port `5672:5672` (AMQP) dan `15672:15672` (UI Management).
    3.  **Redis (v7+)**: Port `6379:6379`.
*   **Acceptance Criteria (AC):** Menjalankan `docker-compose -f docker-compose.infra.yml up -d` akan menjalankan 3 service di atas tanpa error.

---

## 🔐 PHASE 1: AUTH SERVICE (Service 1)
*Fokus: Registrasi, Login, dan Validasi JWT.*

**Task 1.1: Database Setup (`builder_auth`)**
*   Tabel `users`: `id` (UUID), `email` (Varchar, Unique), `password_hash` (Varchar), `role` (Enum: free, premium), `created_at`.

**Task 1.2: Endpoint Auth**
*   **`POST /auth/register`**: Payload `{ email, password }`. Hash password menggunakan bcrypt.
*   **`POST /auth/login`**: Payload `{ email, password }`. Return JWT Token.
    *   *Payload JWT wajib berisi:* `{ userId, role, exp }`.
*   **`GET /auth/me`**: Validasi JWT di header `Authorization: Bearer <token>`. Return data user.
*   **AC:** Login gagal return HTTP 401. Login sukses return Token dengan waktu expired 24 jam.

---

## 📝 PHASE 2: WORKSPACE SERVICE (Service 2 - The Core)
*Fokus: Menyimpan data Tiptap JSON dan Project.*

**Task 2.1: Database Setup (`builder_workspace`)**
*   Tabel `projects`: `id` (UUID), `user_id` (UUID), `name` (Varchar), `domain` (Varchar, Unique).
*   Tabel `pages`: `id` (UUID), `project_id` (UUID, FK), `slug` (Varchar, misal: 'home', 'about'), `content_json` (**JSONB** - Sangat penting!), `published_html` (Text, nullable).

**Task 2.2: Endpoint CRUD Projects & Pages**
*   **Middleware:** Semua endpoint wajib memvalidasi JWT Token dengan memanggil `Auth Service`.
*   **`GET /projects`**: Return list project milik user yang sedang login.
*   **`POST /projects/:projectId/pages`**: Create page baru.
*   **`PUT /pages/:pageId`**: Payload `{ content_json: { ... } }`. Update struktur editor. Update ini harus cepat (untuk auto-save).

**Task 2.3: Implementasi Publisher (RabbitMQ Producer)**
*   **`POST /pages/:pageId/publish`**:
    *   **Logic:** Endpoint ini **TIDAK** merender HTML. Endpoint ini hanya mengambil `content_json` dari database, lalu mengirimkan pesan ke RabbitMQ.
    *   **RabbitMQ Config:**
        *   Exchange: `builder.exchange` (Type: Direct).
        *   Routing Key: `page.publish`.
        *   Queue Name: `publish_jobs_queue`.
        *   Payload Message: `{ "pageId": "uuid", "projectId": "uuid", "timestamp": "..." }`.
    *   **Response:** Return HTTP 202 (Accepted), message: "Publish in progress".

---

## 🚀 PHASE 3: PUBLISHING SERVICE (Service 3 - The Worker)
*Fokus: Background job, tidak terekspos ke internet publik, hanya mendengarkan RabbitMQ.*

**Task 3.1: RabbitMQ Consumer**
*   Aplikasi harus *listen* secara terus-menerus ke antrean `publish_jobs_queue` di RabbitMQ.

**Task 3.2: Rendering Engine (The Logic)**
*   Saat menerima pesan `{ pageId: "123..." }` dari antrean:
    1.  *Fetch* data `content_json` dari database `builder_workspace` tabel `pages`.
    2.  *Mock Rendering:* Ubah JSON tersebut menjadi string HTML sederhana (untuk saat ini buat *dummy function* konversi, yang penting alurnya jalan).
    3.  *Update DB:* Simpan string HTML tersebut ke kolom `published_html` di database.
    4.  *Cache Update:* Simpan string HTML tersebut ke **Redis** dengan key `site:{domain}:page:{slug}`.
    5.  *Acknowledge (ACK):* Beri tahu RabbitMQ bahwa tugas selesai (hapus dari antrean).
*   **AC:** Jika proses gagal, jangan di-ACK, masukkan ke Dead Letter Queue (DLQ).

**Task 3.3: Endpoint Public Render**
*   **`GET /public/:domain/:slug`**: Endpoint ini yang akan diakses pengunjung website statis.
    *   *Logic:* Cek **Redis** terlebih dahulu menggunakan key `site:{domain}:page:{slug}`. Jika ada, langsung kembalikan HTML. Jika tidak ada, ambil dari database kolom `published_html`, simpan ke Redis, lalu kembalikan HTML.

---

## 🖼️ PHASE 4: MEDIA SERVICE (Service 4)
*Fokus: Upload gambar.*

**Task 4.1: Database Setup (`builder_media`)**
*   Tabel `assets`: `id` (UUID), `user_id` (UUID), `file_url` (Varchar), `size_kb` (Int), `created_at`.

**Task 4.2: Upload Endpoint**
*   **`POST /media/upload`**: Menerima `multipart/form-data`.
    *   *Validasi:* Maksimal 5MB. Hanya format `.jpg, .png, .webp, .svg`.
    *   *Storage:* Simpan ke folder lokal `public/uploads` (sementara) ATAU gunakan MinIO docker image (sebagai simulasi AWS S3).
    *   *Response:* Return `{ file_url: "http://localhost:3004/uploads/image.jpg" }`.

---

## 🚦 PHASE 5: API GATEWAY (Opsional / Nginx)
*Fokus: Satu pintu masuk untuk Frontend.*

**Task 5.1: Konfigurasi API Gateway**
*   Gunakan Nginx (via Docker) atau Kong API Gateway dengan aturan routing:
    *   `/api/auth/*` -> Arahkan ke Auth Service (Port 3001)
    *   `/api/workspace/*` -> Arahkan ke Workspace Service (Port 3002)
    *   `/api/media/*` -> Arahkan ke Media Service (Port 3004)
    *   `/sites/*` -> Arahkan ke endpoint Public Render di Publishing Service (Port 3003)

---

### Catatan Penutup untuk Tim BE:
*   Fokus pada penyelesaian **Phase 0 hingga Phase 3** terlebih dahulu agar End-to-End flow dari Tiptap (Workspace) -> Push to Queue -> Render HTML (Publishing) bisa berjalan dan dites oleh Frontend. Media Service (Phase 4) adalah prioritas kedua. Happy Coding! ☕
