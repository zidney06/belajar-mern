import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
	name: 'product',
	initialState: {
		value: []
	},
	reducers: {
		setInitial: (state, action) => {
			state.value = action.payload
		},
		addProduct: (state, action) => {
			state.value.push(action.payload)
		}
	}
})

export const {
	setInitial,
	addProduct
} = productSlice.actions

export default productSlice.reducer