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

export class TokoMekkahDatabase extends Dexie {
  products!: Table<Product>;
  categories!: Table<Category>;
  publishers!: Table<Publisher>;

  constructor() {
    super('TokoMekkahDB');
    
    // Versi 3: Menambahkan tabel publishers
    this.version(3).stores({
      products: '++id, nama, kode, kategori, penerbit, updatedAt',
      categories: '++id, &nama',
      publishers: '++id, &nama'
    });
  }
}

// Inisialisasi Database
export const db_local = new TokoMekkahDatabase();