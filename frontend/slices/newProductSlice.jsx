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
		setTitle: (state, action) => {
			// console.log(action.payload)
			state.value.title = action.payload
		},
		setAuthor: (state, action) => {
			// console.log(action.payload)
			state.value.author = action.payload
		},
		setPrice: (state, action) => {
			// console.log(action.payload)
			state.value.price = action.payload
		},
		setISBN: (state, action) => {
			// console.log(action.payload)
			state.value.ISBN = action.payload
		},
		setImage: (state, action) => {
			// console.log(action.payload)
			state.value.image = action.payload
		},
		setTag: () => {}
	}
})

export const {
	setTitle,
	setAuthor,
	setPrice,
	setISBN,
	setImage,
	setTag
} = newProductSlice.actions

export default newProductSlice.reducer