import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import './styles/style.css'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {setInitial} from '../slices/productSlice'
import {useDispatch} from 'react-redux'

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		axios.get('http://localhost:3000/products')
		.then((res) => {
			dispatch(setInitial(res.data))
			console.log(res.data)
		})
		.catch((e) => {
			console.log(e)
		})
	}, [])

  return (
    <>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/create" element={<CreatePage />} />
			</Routes>
    </>
  )
}

export default App
