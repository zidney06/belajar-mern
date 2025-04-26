import {useState, useCallback, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {setValue} from '../../slices/newProductSlice'


export default function CreatePage() {
	const dispatch = useDispatch()
	const newProduct = useSelector((state) => state.newProduct.value)
	const title = useRef('')
	const author = useRef('')
	const price = useRef('')
	const ISBN = useRef('')
	const image = useRef('')
	const tags = useRef([])

	const hndlConfirm = () => {
		console.log(title.current.value, author.current.value, price.current.value)
	}

	return (
	<div className="container-fluid p-0 my-5">
		<div className="dev-input-box mx-auto border border-info rounded border-2 px-2">
			<h1 className="text-center">Input Data</h1>
			<div className="mb-3">
  			<label htmlFor="title" className="form-label">Title</label>
  			<input ref={title} type="text" className="form-control" id="title" placeholder="Title" />
			</div>
			<div className="mb-3">
  			<label htmlFor="Author" className="form-label">Author</label>
  			<input ref={author} type="text" className="form-control" id="Author" placeholder="Author" />
			</div>
			<div className="mb-3">
  			<label htmlFor="Price" className="form-label">Price</label>
  			<input ref={price} type="text" className="form-control" id="Price" placeholder="Price" />
			</div>
			<div className="mb-3">
  			<label htmlFor="ISBN" className="form-label">ISBN</label>
  			<input ref={ISBN} type="text" className="form-control" id="ISBN" placeholder="000-000-000" />
			</div>
			{/*bagian image nanti diubah menjadi input type file*/}
			<div className="mb-3">
  			<label htmlFor="Image" className="form-label">Image</label>
  			<input ref={image} type="text" className="form-control" id="Image" placeholder="https://image.com" />
			</div>
			<p className="text-center">Pilih tipe buku</p>
			<div className="form-check">
  			<input className="form-check-input" type="checkbox" value="komik" id="komik" />
  			<label className="form-check-label" htmlFor="komik">
    			Komik
  			</label>
			</div>
			<div className="form-check">
  			<input className="form-check-input" type="checkbox" value="majalah" id="majalah" />
  			<label className="form-check-label" htmlFor="majalah">
    			Majalah
  			</label>
			</div>
			<div className="my-3 d-flex justify-content-between">
				<button className="btn btn-outline-danger">Hapus Input</button>
				<button className="btn btn-outline-primary" onClick={hndlConfirm}>Konfirmasi</button>
			</div>
		</div>
	</div>
	)
}