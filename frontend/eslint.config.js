// eslint.config.js

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
	// 1. Konfigurasi Global (Mengabaikan File)
	{
		ignores: ["dist/", "build/", "node_modules/"],
	},

	// 2. Konfigurasi JavaScript Dasar (Berlaku untuk semua file)
	js.configs.recommended,

	// 3. Konfigurasi TypeScript dan TSX
	...tseslint.configs.recommended, // Aturan dasar TS
	{
		files: ["**/*.{ts,tsx}"], // Targetkan hanya file TS/TSX
		languageOptions: {
			// **PENTING: Gunakan Parser dari @typescript-eslint**
			parserOptions: {
				project: ["./tsconfig.json"], // Harus menunjuk ke file tsconfig.json Anda
				ecmaFeatures: {
					jsx: true,
				},
			},
			// Menetapkan lingkungan global (browser, node, dsb.)
			globals: {
				...globals.browser,
				// ...globals.node, // Hapus jika ini hanya kode front-end
			},
		},
		// Menambahkan aturan khusus untuk TypeScript
		rules: {
			// Contoh: ganti aturan JS bawaan yang konflik dengan TS
			"no-unused-vars": "off", // Matikan aturan JS
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			], // Aktifkan aturan TS

			// Aturan TS lainnya
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},

	// 4. Konfigurasi React
	{
		files: ["**/*.{js,jsx,ts,tsx}"], // Berlaku untuk semua file komponen
		plugins: {
			react,
			"react-hooks": reactHooks,
		},
		settings: {
			react: {
				version: "detect", // Otomatis mendeteksi versi React
			},
		},
		rules: {
			// Aturan untuk JSX (React 17+)
			...react.configs["jsx-runtime"].rules,

			// Aturan React Hooks
			...reactHooks.configs.recommended.rules,

			// Matikan aturan yang sudah ditangani oleh TypeScript
			"react/prop-types": "off",
		},
	},
);
