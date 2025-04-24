import {configureStore} from '@reduxjs/toolkit'
import productReducer from '../slices/productSlice'
import newProductReducer from '../slices/newProductSlice'

export const store = configureStore({
	reducer: {
		products: productReducer,
		newProduct: newProductReducer
	}
})