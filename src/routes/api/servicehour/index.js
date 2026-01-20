// src/some_file.js (Nama file Anda mungkin berbeda)
import { pool } from "../../../lib/db/postgresql.js";

async function getServiceHour() {
    const query = `
        SELECT DISTINCT ON (unit)
            waktu, unit, service_hour AS jamoperasi
        FROM jso
        WHERE service_hour >= 0
        ORDER BY
            unit ASC,
            id DESC       
        LIMIT 17;

    `;
    // Untuk pg, kita tidak perlu array 'values' kosong jika tidak ada parameter yang akan di-bind.
    // Namun, jika ada, pg menggunakan array untuk parameter.
    // const values = []; 

    try {
        // Menggunakan pool.query() langsung dari pg, yang mengembalikan objek 'result'
        // Dengan destructurizing, kita bisa mendapatkan 'rows' dari result.
        const result = await pool.query(query); // <-- Perubahan di sini
        const rows = result.rows; // Data ada di properti 'rows'

        // console.log("Data fetched:", rows); // Opsional: untuk debug
        return rows;
    } catch (err) {
        console.error('Database error:', err);
        return [];
    }
}

export async function GET() {
    try {
        const result = await getServiceHour();
        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('API error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
