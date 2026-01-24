// src/lib/db/postgresql.js
import { Pool } from 'pg'; // Menggunakan Pool dari 'pg'
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ // Inisialisasi Pool untuk PostgreSQL
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'), // Port default PostgreSQL adalah 5432
    max: 10, // Jumlah maksimum koneksi klien dalam pool
    idleTimeoutMillis: 30000, // Berapa lama klien dapat berada dalam keadaan idle sebelum diakhiri
    connectionTimeoutMillis: 2000, // Berapa lama klien akan menunggu untuk membangun koneksi baru
});

// Event listener untuk log ketika klien terhubung
pool.on('connect', () => {
    console.log('Client connected to PostgreSQL');
});

export { pool };
