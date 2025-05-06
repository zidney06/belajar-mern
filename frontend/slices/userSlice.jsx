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
		setValue: (state, action) => {
			state.value.data = action.payload
		},
		delValue: (state) => {
			state.value.data = null
		},
		setProducts: (state, action) => {
			state.value.products = action.payload
		},
		addProduct: (state, action) => {
			state.value.products.push(action.payload)
		},
		delProduct: (state, action) => {
			state.value.products = state.value.products.filter((item, i) => {
				if(i === action.payload.index){
					return
				}
				return item
			})
		},
		editProduct: (state, action) => {
			state.value.products = state.value.products.map((product, i) => {
				if(product._id === action.payload.id){
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

export const {setValue, delValue, setProducts} = newProductSlice.actions

export default newProductSlice.reducer