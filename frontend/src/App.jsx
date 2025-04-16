import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import Navbar from './components/Navbar'
import './styles/style.css'

function App() {
  return (
    <div>
    	<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/create" element={<CreatePage />} />
			</Routes>
    </div>
  )
}

export default App
