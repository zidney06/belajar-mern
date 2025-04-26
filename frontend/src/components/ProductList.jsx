import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

export default function ProductList ({header, tag}) {
	const books = useSelector((state) => state.products.value)
	
	const filteredBooks = books.filter(book => book.tags.some(el => el === tag))

  return (
  <div className="my-3 border rounded p-1">
		<h4>{header}</h4>
		<div className="container-fluid d-flex overflow-auto p-2">
		{filteredBooks.map((book, i) => (
			<div className="card dev-card mx-1" key={i}>
			  <img src={book.image} className="card-img-top" alt="..." />
			  <div className="card-body p-1">
			    <h5 className="card-title">{book.title}</h5>
			    <p>{book.tags}</p>
			  </div>
			</div>	
		))}
		</div>
	</div>
  )
}
