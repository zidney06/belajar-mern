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

export interface InitialState {
	value: Product[];
}

// besok lanjut ngasih type ke state dan sction

const productSlice = createSlice({
	name: "product",
	initialState: {
		value: [],
	} as InitialState,
	reducers: {
		setInitial: (state: InitialState, action: PayloadAction<Product[]>) => {
			state.value = action.payload;
		},
		addProduct: (state: InitialState, action: PayloadAction<Product>) => {
			state.value.push(action.payload);
		},
		delProduct: (
			state: InitialState,
			action: PayloadAction<{ id: string }>,
		) => {
			state.value = state.value.filter((item, i) => {
				if (item._id !== action.payload.id) {
					return item;
				}
			});
		},
		editProduct: (state: InitialState, action: PayloadAction<Product>) => {
			state.value = state.value.map((product, i) => {
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

export const { setInitial, addProduct, delProduct, editProduct } =
	productSlice.actions;

export default productSlice.reducer;
