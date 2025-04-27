import {useState, useCallback, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {addProduct} from '../../slices/productSlice'


export default function CreatePage() {
	const dispatch = useDispatch()
	const products = useSelector((state) => state.products.value)
	const title = useRef('')
	const author = useRef('')
	const price = useRef('')
	const ISBN = useRef('')
	const image = useRef('')
	const [tags, setTags] = useState([])

	const hndlConfirm = () => {
		dispatch(addProduct({
			title: title.current.value,
			author: author.current.value,
			price: price.current.value,
			ISBN: ISBN.current.value,
			image: image.current.value,
			tags: tags
		}))

		resetValue()
	}
	const hndlChange = (e) => {
		const {value, checked} = e.target

		if(checked){
			setTags(prev => [...prev, value])
		}
		else {
			setTags(prev => prev.filter(item => item !== value))
		}
	}
	const resetValue = () => {
		title.current.value = ""
		author.current.value = ""
		price.current.value = ""
		ISBN.current.value = ""
		image.current.value = ""
		setTags([])
	}

	// console.log(products)

	return (
	<div className="container-fluid p-0 my-5">
		<div className="dev-input-box mx-auto border border-info rounded border-2 px-2">
			<h1 className="text-center">Input Data</h1>
			<div className="mb-3">
  			<label htmlFor="title" className="form-label">Title</label>
  			<input ref={title} type="text" className="form-control" id="title" placeholder="Title" autoComplete="off" />
			</div>
			<div className="mb-3">
  			<label htmlFor="Author" className="form-label">Author</label>
  			<input ref={author} type="text" className="form-control" id="Author" placeholder="Author" autoComplete="off" />
			</div>
			<div className="mb-3">
  			<label htmlFor="Price" className="form-label">Price</label>
  			<input ref={price} type="text" className="form-control" id="Price" placeholder="Price" autoComplete="off" />
			</div>
			<div className="mb-3">
  			<label htmlFor="ISBN" className="form-label">ISBN</label>
  			<input ref={ISBN} type="text" className="form-control" id="ISBN" placeholder="000-000-000" autoComplete="off" />
			</div>
			{/*bagian image nanti diubah menjadi input type file*/}
			<div className="mb-3">
  			<label htmlFor="Image" className="form-label">Image</label>
  			<input ref={image} type="text" className="form-control" id="Image" placeholder="https://image.com" autoComplete="off" />
			</div>
			<p className="text-center">Pilih tipe buku</p>
			<div className="form-check">
  			<input className="form-check-input" type="checkbox" value="komik" id="komik" checked={tags.includes("komik")} onChange={hndlChange} />
  			<label className="form-check-label" htmlFor="komik">
    			Komik
  			</label>
			</div>
			<div className="form-check">
  			<input className="form-check-input" type="checkbox" value="majalah" id="majalah" checked={tags.includes("majalah")} onChange={hndlChange} />
  			<label className="form-check-label" htmlFor="majalah">
    			Majalah
  			</label>
			</div>
			<div className="my-3 d-flex justify-content-between">
				<button className="btn btn-outline-danger" onClick={resetValue}>Hapus Input</button>
				<button className="btn btn-outline-primary" onClick={hndlConfirm}>Konfirmasi</button>
			</div>
		</div>
		<div className="my-3 border rounded p-1">
			<h4>Daftar Buku Tersedia</h4>
			<div className="container-fluid d-flex overflow-auto p-2">
			{products.map((book, i) => (
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
	</div>
	)
}