import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
	name: 'product',
	initialState: {
		value: []
	},
	reducers: {
		setInitial: (state, action) => {
			state.value = action.payload
		}
	}
})

export const {
	setInitial
} = productSlice.actions

export default productSlice.reducer