import {createSlice} from '@reduxjs/toolkit'

const newProductSlice = createSlice({
	name: 'product',
	initialState: {
		value: {
			data: null,
			products: []
		}
	},
	reducers: {
		setUser: (state, action) => {
			state.value.data = action.payload
		},
		delUser: (state) => {
			state.value.data = null
		},
		setUserProducts: (state, action) => {
			state.value.products = action.payload
		},
		addUserProduct: (state, action) => {
			state.value.products.push(action.payload)
		},
		delUserProduct: (state, action) => {
			state.value.products = state.value.products.filter((item, i) => {
				if(i === action.payload.index){
					return
				}
				return item
			})
		},
		editUserProduct: (state, action) => {
			console.log(action.payload)
			state.value.products = state.value.products.map((product, i) => {
				if(product._id === action.payload._id){
					return {...product, 
						title: action.payload.title,
						author: action.payload.author,
						price: action.payload.price,
						ISBN: action.payload.ISBN,
						image: action.payload.image,
						tags: action.payload.tags,
					}
				}
				return product
			})
		}
	}
})

export const {
	setUser, 
	delUser, 
	setUserProducts, 
	delUserProduct,
	addUserProduct,
	editUserProduct
} = newProductSlice.actions

export default newProductSlice.reducer