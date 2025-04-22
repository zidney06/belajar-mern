import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import Navbar from './components/Navbar'
import './styles/style.css'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {setInitial} from '../slices/productSlice'
import {useDispatch} from 'react-redux'

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		axios.get('http://localhost:3000/books')
		.then((res) => {
			dispatch(setInitial(res.data))
			console.log(res)
		})
		.catch((e) => {
			console.log(e)
		})
	}, [])

  return (
    <>
    	<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/create" element={<CreatePage />} />
			</Routes>
    </>
  )
}

export default App
