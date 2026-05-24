# 📋 FRONTEND ENGINEERING TASKS: Storefront Renderer (Next.js)

## 🚨 KONSEP UTAMA (WAJIB DIBACA)
1. **Separation of Concerns:** Repositori `Storefront` ini **BERBEDA** dengan repositori `WebBuilder Studio` (Vite/React).
2. **Tujuan Utama:** Repositori ini murni berfungsi sebagai **Rendering Engine publik**. Tugasnya hanya mengambil data JSON (struktur Tiptap) dari Backend Microservices, merendernya menjadi HTML menggunakan Server-Side Rendering (SSR), dan menyajikannya kepada pengunjung publik.
3. **Fokus SEO & Kecepatan:** Karena ini adalah website *Production* milik user, SEO (Metadata) dan performa (Core Web Vitals) adalah prioritas mutlak.
4. **Tech Stack:** **Next.js (App Router)** + TypeScript + Tailwind CSS.

---

## 🏗️ PHASE 1: SETUP PROJECT & ROUTING DASAR

**Task 1.1: Inisialisasi Next.js**
*   Buat project baru menggunakan Next.js (App Router) dengan Tailwind CSS.
*   *Note:* Jangan menginstal dependensi editor (Tiptap, Zustand editor state, dll) di repo ini. Repo ini harus ringan.

**Task 1.2: Dynamic Routing (Subdomain/Slug Routing)**
*   **Deskripsi:** Siapkan struktur folder App Router untuk menangkap URL publik.
*   **Struktur Folder:**
    *   `app/[domain]/page.tsx` -> Untuk menangkap Homepage dari domain tertentu.
    *   `app/[domain]/[slug]/page.tsx` -> Untuk menangkap halaman spesifik (contoh: `/about`, `/contact`).
*   **Logic (Mock):** Untuk sementara, tangkap param `domain` dan `slug`, lalu tampilkan teks statis (misal: "Rendering domain: mywebsite, slug: home").

---

## 🔗 PHASE 2: INTEGRASI DENGAN BACKEND (FETCHING DATA)

**Task 2.1: Setup API Service Client**
*   Buat file service (misal: `lib/api.ts`) untuk berkomunikasi dengan API Gateway Backend (Layanan Workspace/Publishing).
*   Buat fungsi `fetchPageData(domain: string, slug: string)`.

**Task 2.2: Server-Side Data Fetching (SSR)**
*   Di dalam `app/[domain]/[slug]/page.tsx`, gunakan Server Components untuk memanggil `fetchPageData`.
*   **Skenario Gagal:** Jika API mengembalikan 404 (Halaman/Domain tidak ditemukan), kembalikan `notFound()` bawaan Next.js.
*   **Skenario Sukses:** Teruskan `content_json` (data Tiptap) ke komponen *Renderer*.

---

## 🎨 PHASE 3: BUILDING THE TIPTAP RENDERER

**Task 3.1: Buat Parser JSON ke HTML (Tiptap to React)**
*   **Deskripsi:** Ini adalah bagian tersulit. Anda menerima raw JSON dari Tiptap (contoh: `{ type: 'doc', content: [...] }`). Anda harus mengubahnya menjadi React Components murni.
*   **Strategi:**
    *   Jangan gunakan `<EditorContent />` milik Tiptap.
    *   Buat fungsi rekursif `RenderNode({ node })` yang membaca `node.type`.
    *   Jika `type === 'heroHeadline'`, return `<h1 className="...">...</h1>`.
    *   Jika `type === 'layoutRow'`, return `<div className="flex...">...</div>`.

**Task 3.2: Replikasi Komponen UI (Shared UI)**
*   Salin struktur komponen dasar dari repo `WebBuilder Studio` (seperti Button, Badge, Card) ke repo ini.
*   Pastikan styling Tailwind persis sama, tetapi komponen ini bersifat **Read-Only** (tidak ada interaksi klik untuk edit, tidak ada drag-and-drop).

**Task 3.3: Integrasi CSS Variables (Theming)**
*   Baca konfigurasi `theme` yang dikirim dari API.
*   Suntikkan CSS Variables (`--primary-color`, dll) ke root container halaman agar styling (FrostUI, GenZ, dll) teraplikasi dengan benar.

---

## 🚀 PHASE 4: SEO & OPTIMIZATION

**Task 4.1: Metadata (SEO)**
*   Gunakan fitur `generateMetadata()` dari Next.js App Router.
*   Set Tag `<title>`, `<meta name="description">`, dan Open Graph tags (`og:image`) berdasarkan data *Page Settings* yang didapat dari API.

**Task 4.2: Image Optimization**
*   Semua gambar yang di-render dari node `imageElement` harus menggunakan komponen `<Image />` bawaan `next/image`.
*   Ini memastikan gambar di-compress dan di-lazy-load otomatis untuk performa maksimal.

**Task 4.3: ISR / Caching Strategy**
*   Jangan lakukan SSR mentah setiap kali halaman di-refresh. Gunakan fitur *Incremental Static Regeneration (ISR)* Next.js.
*   Set parameter `revalidate: 60` pada fungsi `fetch`, sehingga Next.js akan men-cache HTML selama 60 detik sebelum meminta JSON baru ke backend. Ini akan meringankan beban database Backend Anda.

---

## 🚦 PHASE 5: HANDLING CUSTOM DOMAINS (ADVANCED)

**Task 5.1: Next.js Middleware**
*   **Deskripsi:** Jika pengguna mem-pointing domain mereka sendiri (misal: `www.toko-kopi.com`) ke server Anda, Storefront harus tahu *project* mana yang harus di-render.
*   **Implementasi:** Gunakan `middleware.ts` Next.js.
    *   Cek `req.headers.get('host')`.
    *   Jika host bukan domain utama Anda (misal bukan `landostudio.com`), lakukan *rewrite* URL secara internal dari `www.toko-kopi.com/about` menjadi `/[domain]/[slug]` (contoh internal: `/toko-kopi.com/about`).
    *   Ini membuat routing di Phase 1 tetap berfungsi walau diakses dari Custom Domain.

---

### Catatan Penutup untuk Tim Frontend (Storefront):
*   Fokus utama repositori ini adalah **Kecepatan** dan **Read-Only Rendering**.
*   Pastikan hasil render di sini persis (*pixel-perfect*) dengan apa yang dilihat user saat melakukan preview di repositori `WebBuilder Studio`.
