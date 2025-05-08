import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import LoginPage from './pages/LoginPage'
import './styles/style.css'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {setInitial} from '../slices/productSlice'
import {useDispatch} from 'react-redux'
import Navbar from './components/Navbar';
import Footer from './components/Footer'

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		axios.get('http://localhost:3000/api/product')
		.then((res) => {
			dispatch(setInitial(res.data.data))
			console.log(res.data.data)
		})
		.catch((e) => {
			console.log(e)
		})
	}, [])

	console.log('app')

  return (
    <>
    	<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/create" element={<CreatePage />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
			<Footer />
    </>
  )
}

export default App
