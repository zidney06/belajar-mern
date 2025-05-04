import {createSlice} from '@reduxjs/toolkit'

const newProductSlice = createSlice({
	name: 'product',
	initialState: {
		value: null
	},
	reducers: {
		setValue: (state, action) => {
			state.value = action.payload
		},
		delValue: (state) => {
			state.value = null
		}
	}
})

export const {setValue, delValue} = newProductSlice.actions

export default newProductSlice.reducer