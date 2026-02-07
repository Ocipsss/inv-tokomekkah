import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil cookie 'user-role'
  const role = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // 2. Tentukan rute yang bersifat publik (bisa diakses tanpa login)
  const isPublicPage = pathname.startsWith('/login');

  // 3. LOGIKA PROTEKSI:
  
  // Jika user BELUM login dan mencoba mengakses halaman selain login
  if (!role && !isPublicPage) {
    // Redirect ke login, sambil menyimpan URL asal agar bisa kembali setelah login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika user SUDAH login tapi mencoba mengakses halaman login
  if (role && isPublicPage) {
    // Tendang balik ke beranda/dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Izinkan akses jika memenuhi syarat
  return NextResponse.next();
}

// Konfigurasi matcher untuk mengecualikan file statis dan internal Next.js
export const config = {
  matcher: [
    /*
     * Match semua request path kecuali:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - *.svg, *.png (gambar di folder public)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.svg|.*\\.png).*)',
  ],
};