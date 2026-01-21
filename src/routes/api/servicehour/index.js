// src/some_file.js (Nama file Anda mungkin berbeda)
import { pool } from "../../../lib/db/postgresql.js";

async function getServiceHour() {
    const query = `
        SELECT
            jso_filtered.waktu,
            jso_filtered.unit,
            jso_filtered.service_hour AS jamoperasi
        FROM (
            SELECT
                waktu,
                unit,
                service_hour,
                ROW_NUMBER() OVER (PARTITION BY unit ORDER BY service_hour DESC, id DESC) as rn
            FROM
                jso
            WHERE
                service_hour > 0 -- Hanya mencari service_hour yang lebih dari 0
                AND unit NOT IN (1, 2, 6, 14, 16, 17) -- Mengecualikan unit tertentu
        ) AS jso_filtered
        WHERE
            jso_filtered.rn = 1 -- Mengambil hanya satu baris (yang terbaru/tertinggi service_hour) per unit
        ORDER BY
            jso_filtered.unit ASC
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
