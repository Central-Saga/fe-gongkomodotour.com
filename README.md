# FE Parthamanunggal

Frontend application untuk Parthamanunggal menggunakan Next.js 15 dengan TypeScript.

## Fitur

- **Next.js 15** dengan Turbopack untuk development yang cepat
- **TypeScript** untuk type safety
- **Tailwind CSS v4** untuk styling
- **Axios** untuk HTTP requests dengan fallback mechanisms
- **Utility functions** untuk common operations

## Struktur Project

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── lib/                # Utility libraries
│   ├── api.ts          # API configuration dengan Axios
│   └── utils.ts        # Common utility functions
└── types/              # TypeScript type definitions
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Build untuk production:
```bash
npm run build
```

## API Configuration

File `src/lib/api.ts` berisi konfigurasi untuk API calls:

- Base URL: `https://api.parthamanunggal.com`
- Automatic Bearer token injection
- Fallback mechanisms untuk error handling
- Timeout 30 detik
- CORS handling

### Penggunaan API

```typescript
import { apiRequest } from '@/lib/api';

// GET request
const data = await apiRequest<YourType>('GET', '/endpoint');

// POST request
const result = await apiRequest<ResponseType>('POST', '/endpoint', {
  key: 'value'
});
```

## Utility Functions

File `src/lib/utils.ts` berisi utility functions:

- `cn()` - Class name merging dengan Tailwind
- `formatCurrency()` - Format currency Indonesia
- `formatDate()` - Format tanggal Indonesia
- `formatDateTime()` - Format tanggal dan waktu
- `generateId()` - Generate random ID
- `debounce()` - Debounce function
- `throttle()` - Throttle function
- `isEmpty()` - Check object empty
- `deepClone()` - Deep clone object

## Environment Variables

Untuk development, buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.parthamanunggal.com
NODE_ENV=development
```

## Scripts

- `npm run dev` - Development server dengan Turbopack
- `npm run build` - Build production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Dependencies

### Production
- Next.js 15.5.2
- React 19.1.0
- Axios
- clsx
- tailwind-merge

### Development
- TypeScript
- ESLint
- Tailwind CSS v4

## Browser Support

- Modern browsers dengan ES6+ support
- Fallback mechanisms untuk older browsers

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes dengan message yang jelas
4. Push ke branch
5. Buat Pull Request

## License

Private project - Parthamanunggal
