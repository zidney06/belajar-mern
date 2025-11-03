// src/vite-env.d.ts atau types/vite.d.ts

// Perluas tipe 'ImportMeta'
interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// Definisikan tipe untuk properti 'env'
interface ImportMetaEnv {
	// Semua variabel env dari Vite yang dimulai dengan VITE_
	readonly VITE_BASE_URL: string;
	readonly VITE_API_KEY: string; // Tambahkan jika Anda punya variabel lain

	// ... Anda bisa menambahkan variabel lingkungan lain di sini
}
