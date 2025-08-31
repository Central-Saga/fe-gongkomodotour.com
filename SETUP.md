# Setup Environment Variables

## Langkah-langkah Setup

### 1. Buat File .env.local

Buat file `.env.local` di root project dengan isi berikut:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.parthamanunggal.com

# Authentication
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback

# App Configuration
NEXT_PUBLIC_APP_NAME=Parthamanunggal
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=development

# Development
NODE_ENV=development
```

### 2. Copy dari Template

Atau copy isi dari file `env-template.txt` ke file `.env.local` yang baru dibuat.

### 3. Restart Development Server

Setelah membuat file `.env.local`, restart development server:

```bash
npm run dev
# atau
yarn dev
```

## Environment Variables yang Diperlukan

### Wajib

-   `NEXT_PUBLIC_API_URL`: URL API backend
-   `NODE_ENV`: Environment (development/production)

### Opsional

-   `NEXT_PUBLIC_AUTH_REDIRECT_URL`: URL redirect untuk authentication
-   `NEXT_PUBLIC_APP_NAME`: Nama aplikasi
-   `NEXT_PUBLIC_APP_VERSION`: Versi aplikasi
-   `NEXT_PUBLIC_APP_ENV`: Environment aplikasi

## Catatan Penting

-   File `.env.local` tidak akan masuk ke repository (sudah di-ignore)
-   `.env.local` memiliki prioritas tertinggi dan mengoverride file .env lainnya
-   Semua variable yang dimulai dengan `NEXT_PUBLIC_` akan tersedia di client-side
-   Variable tanpa `NEXT_PUBLIC_` hanya tersedia di server-side
-   Jangan commit file `.env.local` yang berisi credentials atau secrets

## Urutan Prioritas Environment Variables di Next.js

1. `.env.local` (prioritas tertinggi, tidak di-commit)
2. `.env.development` atau `.env.production`
3. `.env` (prioritas terendah)

## Troubleshooting

Jika ada error "process.env.NEXT_PUBLIC_API_URL is undefined":

1. Pastikan file `.env.local` ada di root project
2. Restart development server
3. Check apakah nama variable sudah benar
4. Pastikan tidak ada spasi atau karakter khusus
5. Pastikan file tidak tersimpan dengan ekstensi `.txt`
