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
			state.value.title = action.payload.title
			state.value.author = action.payload.author
			state.value.price = action.payload.price
			state.value.ISBN = action.payload.ISBN
			state.value.image = action.payload.image
			state.value.tags = action.payload.tags
		}
	}
})

export const {setValue} = newProductSlice.actions

export default newProductSlice.reducer