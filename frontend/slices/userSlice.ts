import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Product {
	_id: string;
	title: string;
	author: string;
	price: number;
	ISBN: string;
	imageUrl: string;
	imageName: string;
	tags: string[];
}

interface Data {
	username: string;
	email: string;
	_id: string;
}

interface Value {
	data: Data;
	products: Product[];
}

export interface InitialState {
	value: Value;
}

const newProductSlice = createSlice({
	name: "product",
	initialState: {
		value: {
			data: {
				username: "",
				email: "",
				_id: "",
			},
			products: [],
		},
	} as InitialState,
	reducers: {
		setUser: (state: InitialState, action: PayloadAction<Data>) => {
			state.value.data = action.payload;
		},
		delUser: (state: InitialState) => {
			state.value.data = {
				username: "",
				email: "",
				_id: "",
			};
		},
		setUserProducts: (
			state: InitialState,
			action: PayloadAction<Product[]>,
		) => {
			console.log(action.payload);
			state.value.products = action.payload;
		},
		addUserProduct: (state: InitialState, action: PayloadAction<Product>) => {
			state.value.products.push(action.payload);
		},
		delUserProduct: (
			state: InitialState,
			action: PayloadAction<{ id: string }>,
		) => {
			// kok gak pake id?
			state.value.products = state.value.products.filter((item, i) => {
				if (item._id === action.payload.id) {
					return;
				}
				return item;
			});
		},
		editUserProduct: (state: InitialState, action) => {
			state.value.products = state.value.products.map((product, i) => {
				if (product._id === action.payload._id) {
					return {
						...product,
						title: action.payload.title,
						author: action.payload.author,
						price: action.payload.price,
						ISBN: action.payload.ISBN,
						imageUrl: action.payload.imageUrl,
						imageName: action.payload.imageName,
						tags: action.payload.tags,
					};
				}
				return product;
			});
		},
	},
});

export const {
	setUser,
	delUser,
	setUserProducts,
	delUserProduct,
	addUserProduct,
	editUserProduct,
} = newProductSlice.actions;

export default newProductSlice.reducer;
