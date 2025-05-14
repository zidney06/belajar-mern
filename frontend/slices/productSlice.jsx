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
				console.log('item id:' + item._id)
				console.log('id: ' + action.payload.id)
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
	setInitial,
	addProduct,
	delProduct,
	editProduct
} = productSlice.actions

export default productSlice.reducer