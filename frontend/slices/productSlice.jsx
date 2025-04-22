import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
	name: 'product',
	initialState: {
		value: [
			// {
			// 	title: 'Buku Sejarah Indonesia',
			// 	author: 'Atin',
			// 	price: 12000,
			// 	ISBN: '123-234-345',
			// 	image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			// },
			// {
			// 	title: 'Buku Tulis',
			// 	author: 'Mia ni',
			// 	price: 17500,
			// 	ISBN: '123-234-345',
			// 	image: "https://media.istockphoto.com/id/1180068638/photo/open-book-on-autumn-grass-and-fallen-leaves.webp?a=1&s=612x612&w=0&k=20&c=nXxQurwM2YNEWkRU2fwq0H0WZJRusdnyEpnpI0Poxd4="
			// },
			// {
			// 	title: 'Buku Sosial',
			// 	author: 'Andik',
			// 	price: 23000,
			// 	ISBN: '123-234-345',
			// 	image: "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			// },
			// {
			// 	title: 'Buku Sejarah',
			// 	author: 'Atin',
			// 	price: 12000,
			// 	ISBN: '123-234-345',
			// 	image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			// },
			// {
			// 	title: 'Buku Tulis',
			// 	author: 'Mia ni',
			// 	price: 17500,
			// 	ISBN: '123-234-345',
			// 	image: "https://media.istockphoto.com/id/1180068638/photo/open-book-on-autumn-grass-and-fallen-leaves.webp?a=1&s=612x612&w=0&k=20&c=nXxQurwM2YNEWkRU2fwq0H0WZJRusdnyEpnpI0Poxd4="
			// },
			// {
			// 	title: 'Buku Sosial',
			// 	author: 'Andik',
			// 	price: 23000,
			// 	ISBN: '123-234-345',
			// 	image: "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			// }
		]
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