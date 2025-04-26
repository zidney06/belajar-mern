import {createSlice} from '@reduxjs/toolkit'

const tamlate = {
	title: '',
	author: '',
	price: 0,
	ISBN: '',
	image: '',
	tags: []
}

const newProductSlice = createSlice({
	name: 'product',
	initialState: {
		value: tamlate
	},
	reducers: {
		setValue: (state, action) => {
			state.value.title = action.payload
		}
	}
})

export const {setValue} = newProductSlice.actions

export default newProductSlice.reducer