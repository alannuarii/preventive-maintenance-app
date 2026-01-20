// src/some_file.js (Nama file Anda mungkin berbeda)
import { pool } from "../../../../lib/db/postgresql.js";

async function getServiceHour(unit) {
    const query = `
        SELECT waktu, unit, service_hour AS jamoperasi
        FROM jso
        WHERE unit = $1
        ORDER BY
            CASE
                WHEN service_hour > 0 THEN 0  
                ELSE 1                       
            END,
            id DESC
        LIMIT 1;
    `;
    // Untuk pg, kita tidak perlu array 'values' kosong jika tidak ada parameter yang akan di-bind.
    // Namun, jika ada, pg menggunakan array untuk parameter.
    const values = [unit]; 

    try {
        // Menggunakan pool.query() langsung dari pg, yang mengembalikan objek 'result'
        // Dengan destructurizing, kita bisa mendapatkan 'rows' dari result.
        const result = await pool.query(query, values); // <-- Perubahan di sini
        const rows = result.rows; // Data ada di properti 'rows'

        // console.log("Data fetched:", rows); // Opsional: untuk debug
        return rows;
    } catch (err) {
        console.error('Database error:', err);
        return [];
    }
}

export async function GET({params}) {
    try {
        const unit = params.unit;
        const result = await getServiceHour(unit);
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
