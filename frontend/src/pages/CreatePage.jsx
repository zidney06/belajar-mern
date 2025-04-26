import {useState, useCallback, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {
	setTitle,
	setAuthor,
	setPrice,
	setISBN,
	setImage,
	setTag
} from '../../slices/newProductSlice'
import {
	Container,
	Box,
	Typography,
	TextField,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Stack,
	Button
} from '@mui/material'

export default function CreatePage() {
	const dispatch = useDispatch()
	const newProduct = useSelector((state) => state.newProduct.value)
	const title = useRef(null)

	const [value, setValue] = useState(null)

	const hndlClck = () => {
		console.log(title.current.querySelector('input').value)
	}
	const hndlTitle = () => {}

	// console.log(title)

	//console.log(newProduct)

	return (
	<Container disableGutters>
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center"
				}}>
				<Box
					sx={{
						width: '85vw',
						border: '2px solid skyblue',
						borderRadius: 2,
						mt: 3
					}}>
					<input onChange={hndlTitle} />
					<Typography variant="h5" sx={{textAlign: 'center', my: 1}}>Membuat data</Typography>
					<Box
						component="form"
						autoComplete="off"
						sx={{
							p: 2
						}}>
						<TextField
							fullWidth
							variant="outlined"
							label="title"
							size="small"
							margin="dense"
							title={title}
							onChange={hndlTitle}/>
						{/*<TextField
							fullWidth
							variant="outlined"
							label="author"
							size="small"
							margin="dense"
							onChange={(e) => dispatch(setAuthor(e.target.value))}/>
						<TextField
							fullWidth
							variant="outlined"
							label="price"
							size="small"
							margin="dense"
							onChange={(e) => dispatch(setPrice(e.target.value))}
							type="number" />
						<TextField
							fullWidth
							variant="outlined"
							label="ISBN"
							size="small"
							onChange={(e) => dispatch(setISBN(e.target.value))}
							margin="dense" />
						<TextField
							fullWidth
							variant="outlined"
							label="image url"
							size="small"
							onChange={(e) => dispatch(setImage(e.target.value))}
							margin="dense" />*/}
						<FormGroup>
							<FormControlLabel control={<Checkbox label="bagus" />} label="komik" />
							<FormControlLabel control={<Checkbox label="bagus" />} label="majalah" />
						</FormGroup>
						<Stack spacing={2} direction="row" sx={{display: 'flex', justifyContent: 'space-between', my: 1}}>
							<Button variant="outlined" color="error" onClick={hndlClck}>batalkan</Button>
							<Button variant="outlined">Konfirmasi</Button>
						</Stack>
					</Box>
				</Box>
			</Box>
			<Box>
				{/*ini untuk menampilkan daftar produk yang dimiliki oleh akun ini*/}
			</Box>
		</Box>
	</Container>
	)
}