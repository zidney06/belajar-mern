import axios, { type AxiosResponse, type AxiosError } from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// 1. Tipe dasar untuk respon sukses
type SuccessResponse<T> = AxiosResponse<T> & {
	success: true;
	err?: never; // Memastikan 'err' tidak ada saat sukses
};

// 2. Tipe dasar untuk respon gagal
type ErrorResponse = {
	success: false;
	err: AxiosError | unknown; // 'err' dari blok catch
	data?: never; // Memastikan 'data' tidak ada saat gagal (opsional, tapi baik)
	status?: never; // dan properti AxiosResponse lainnya
};

// 3. Gabungkan kedua tipe
type CustomFetchResponse<T> = SuccessResponse<T> | ErrorResponse;

export const getFetch = async (
	url: string,
): Promise<CustomFetchResponse<any>> => {
	const token = sessionStorage.getItem("token");

	try {
		const res = await axios.get(baseUrl + url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});

		return { ...res, success: true };
	} catch (err) {
		console.log(err);
		return { err, success: false };
	}
};

export const postFetch = async (
	url: string,
	data: any,
): Promise<CustomFetchResponse<any>> => {
	const token = sessionStorage.getItem("token");

	try {
		const res = await axios.post(baseUrl + url, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});

		return { ...res, success: true };
	} catch (err) {
		console.log(err);
		return { err, success: false };
	}
};

export const putfetch = async (
	url: string,
	data: any,
): Promise<CustomFetchResponse<any>> => {
	const token = sessionStorage.getItem("token");

	try {
		const res = await axios.put(baseUrl + url, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});

		return { ...res, success: true };
	} catch (err) {
		console.log(err);
		return { err, success: false };
	}
};

export const delFetch = async (
	url: string,
): Promise<CustomFetchResponse<any>> => {
	const token = sessionStorage.getItem("token");

	try {
		const res = await axios.delete(baseUrl + url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});

		return { ...res, success: true };
	} catch (err) {
		console.log(err);
		return { err, success: false };
	}
};
