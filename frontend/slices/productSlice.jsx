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
		},
		delProduct: (state, action) => {
			state.value = state.value.filter((item, i) => {
				if(item._id !== action.payload.id){
					return item
				}
			})
			
		},
		editProduct: (state, action) => {
			state.value = state.value.map((product, i) => {
				if(product._id === action.payload._id){
					return {...product, 
						title: action.payload.title,
						author: action.payload.author,
						price: action.payload.price,
						ISBN: action.payload.ISBN,
						imageUrl: action.payload.imageUrl,
						imageName: action.payload.imageName,
						tags: action.payload.tags,
					}
				}
				return product
			})
		}
	}
})

export const {
	setInitial,
	addProduct,
	delProduct,
	editProduct
} = productSlice.actions

export default productSlice.reducer