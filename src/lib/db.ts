import Dexie, { Table } from 'dexie';

// Interface untuk data Produk
export interface Product {
  id?: number;
  nama: string;
  kode: string;
  penerbit: string;
  kategori: string;
  lokasi: string;
  hargaModal: number;
  hargaJual: number;
  stok: number;
  deskripsi?: string;
  updatedAt: number;
}

// Interface untuk data Kategori
export interface Category {
  id?: number;
  nama: string;
}

// Interface untuk data Penerbit
export interface Publisher {
  id?: number;
  nama: string;
}

// Interface untuk data Staff
export interface Staff {
  id?: number;
  nama: string;
  jabatan: string;
  phone: string;
  status: string;
  updatedAt: number;
}

export class TokoMekkahDatabase extends Dexie {
  products!: Table<Product>;
  categories!: Table<Category>;
  publishers!: Table<Publisher>;
  staff!: Table<Staff>; // Tabel baru

  constructor() {
    super('TokoMekkahDB');
    
    // Versi 4: Upgrade untuk mendukung manajemen Staff
    this.version(4).stores({
      products: '++id, nama, kode, kategori, penerbit, updatedAt',
      categories: '++id, &nama',
      publishers: '++id, &nama',
      staff: '++id, nama, jabatan, phone' // Indexing untuk pencarian staff
    });
  }
}

// Inisialisasi Database
export const db_local = new TokoMekkahDatabase();