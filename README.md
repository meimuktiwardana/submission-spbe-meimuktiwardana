## Proyek Backend Online Bookstore

Tech Stack

    Node.js
    Express.js
    PostgreSQL
    Prisma
    NPM

Prasyarat

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:

    Node.js (v16 atau lebih baru direkomendasikan)
    NPM (biasanya sudah terinstal bersama Node.js)
    PostgreSQL

Instalasi dan Setup

Ikuti langkah-langkah berikut untuk menjalankan proyek ini secara lokal.
1. Clone Repositori


        git clone https://github.com/meimuktiwardana/submission-spbe-meimuktiwardana.git
        cd submission-spbe-meimuktiwardana


2. Instal Dependensi

Instal semua dependensi yang dibutuhkan oleh proyek menggunakan NPM.

        npm install

3. Konfigurasi Environment

Buat .env dan isi file tersebut dengan konfigurasi berikut. Sesuaikan dengan pengaturan PostgreSQL dan preferensi Anda.

      # URL Koneksi Database PostgreSQL
      # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
      DATABASE_URL="postgresql://postgres:password@localhost:5432/bookstore_db"
      
      # Kunci rahasia untuk menandatangani JWT
      JWT_SECRET="your-super-secret-jwt-key-here"
      
      # Port untuk menjalankan server
      PORT=3000

4. Setup Database

Jalankan migrasi Prisma untuk membuat semua tabel yang diperlukan di database PostgreSQL Anda sesuai dengan skema.

      npx prisma migrate dev --name init

5. Seed Database

Isi database dengan data awal (seperti data penulis, buku, dan produk) menggunakan seeder yang telah disediakan.

    npx prisma db seed

Menjalankan Aplikasi

Setelah semua setup selesai, Anda dapat menjalankan server.

    npm run dev

Server akan berjalan pada port yang telah Anda tentukan di file .env (default: http://localhost:3000).
## Menguji API

Anda dapat menggunakan alat seperti Postman atau curl untuk menguji endpoint API.

Contoh: Register Pengguna Baru

    curl -X POST http://localhost:3000/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Test User",
        "email": "user@example.com",
        "password": "password123",
        "address": "Jl. Buku No. 1",
        "phone": "081234567890"
      }'

Contoh: Login

    curl -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "email": "user@example.com",
        "password": "password123"
      }'

Contoh: Mendapatkan Semua Buku (Gunakan token dari login)

    curl -X GET http://localhost:3000/books \
      -H "Authorization: Bearer <TOKEN_ANDA_DISINI>"

