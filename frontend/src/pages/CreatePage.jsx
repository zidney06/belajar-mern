import {useState, useCallback, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {addProduct, delProduct, editProduct} from '../../slices/productSlice'
import axios from 'axios'

export default function CreatePage() {
	const dispatch = useDispatch()
	const products = useSelector((state) => state.products.value)
	const title = useRef('')
	const author = useRef('')
	const price = useRef('')
	const ISBN = useRef('')
	const image = useRef('')
	const [tags, setTags] = useState([])
	const [isEdit, setIsEdit] = useState(false)
	const [id, setId] = useState(null)

	const hndlConfirm = () => {
		if(isEdit){
			console.log(image.current.value)
			dispatch(editProduct({
				id: id,
				title: title.current.value,
				author: author.current.value,
				price: price.current.value,
				ISBN: ISBN.current.value,
				image: image.current.value,
				tags: tags
			}))

			axios.put(`http://localhost:3000/api/product/${id}`, {
				title: title.current.value,
				author: author.current.value,
				price: price.current.value,
				ISBN: ISBN.current.value,
				image: image.current.value,
				tags: tags
			})
				.then(res => {
					console.log(res.data)
				})
				.catch(err => {
					console.error(err)
				})

			setIsEdit(false)
			resetValue()
			return
		}
		dispatch(addProduct({
			title: title.current.value,
			author: author.current.value,
			price: price.current.value,
			ISBN: ISBN.current.value,
			image: image.current.value,
			tags: tags
		}))

		axios.post('http://localhost:3000/api/product', {
			title: title.current.value,
			author: author.current.value,
			price: price.current.value,
			ISBN: ISBN.current.value,
			image: image.current.value,
			tags: tags
		})
			.then(res => {
				console.log(res.data)
			})
			.catch(err => {
				console.error(err)
			})

		resetValue()
	}
	const hndlChangeTag = (e) => {
		const {value, checked} = e.target

		if(checked){
			setTags(prev => [...prev, value])
		}
		else {
			setTags(prev => prev.filter(item => item !== value))
		}
	}
	const hndlEdit = (product) => {
		title.current.value = product.title
		author.current.value = product.author
		price.current.value = product.price
		ISBN.current.value = product.ISBN
		image.current.value = product.image
		setTags(product.tags)
		setIsEdit(true)
		setId(product._id)
	}
	const hndlDelete = (index, id) => {
		dispatch(delProduct({index: index}))

		axios.delete(`http://localhost:3000/api/product/${id}`)

		console.log("hapus", id)
	}
	const resetValue = () => {
		title.current.value = ""
		author.current.value = ""
		price.current.value = ""
		ISBN.current.value = ""
		image.current.value = ""
		setTags([])
	}

	console.log(products)

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
  			<input className="form-check-input" type="checkbox" value="komik" id="komik" checked={tags.includes("komik")} onChange={hndlChangeTag} />
  			<label className="form-check-label" htmlFor="komik">
    			Komik
  			</label>
			</div>
			<div className="form-check">
  			<input className="form-check-input" type="checkbox" value="majalah" id="majalah" checked={tags.includes("majalah")} onChange={hndlChangeTag} />
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
			{products.map((product, i) => (
				<div className="card dev-card mx-1" key={i}>
				  <img src={product.image} className="card-img-top" alt="..." />
				  <div className="card-body p-1">
				    <h5 className="card-title">{product.title}</h5>
				    <p>tags: {product.id}</p>
				    <div className="d-flex justify-content-between">
				    	<button className="btn btn-outline-danger" onClick={() => hndlDelete(i, product._id)}>Hapus</button>
				    	<button className="btn btn-outline-primary" onClick={() => hndlEdit(product)}>Edit</button>
				    </div>
				  </div>
				</div>	
			))}
			</div>
		</div>
	</div>
	)
}