import {
	Container,
	Box,
	Typography,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Button
} from '@mui/material'
import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

export default function ProductList ({header, tag}) {
	const books = useSelector((state) => state.books.value)
	console.log('p')
  return (
   <Container
   	component="section"
   	disableGutters
   	sx={{
   		px: 1,
   	}}>
   	<Typography variant="h6">{header}</Typography>
   	<Box
   	sx={{
   		display: 'flex',
   		py: 1,
   		overflowX: 'scroll'
   	}}>
   		{books.map((book, i) => {
   			if(book.tags.some(el => el === tag)){
   				return (
			   		<Card
				   		variant="outlined"
				   		key={i}
				   		sx={{
				   			mx: 2,
				   			border: '1px solid gray',
				   			// flexGrow: 0,
				   			// flexShrink: 0,
				   			// flexBasis: 150
				   			flex: '0 0 150px' //ini shothandnya
				   		}}>
				   		<CardMedia image={book.image} sx={{height: 80, width: '100%'}} />
				   		<CardContent sx={{p: .5, textAlign: 'left'}}>
				   			<Typography>{book.title}</Typography>
				   			<Typography variant="p">Author: {book.author}</Typography><br />
				   			<Typography variant="p">Harga: {book.price}</Typography>
				   			<Typography variant="p">tags: {book.tags}</Typography>
				   		</CardContent>
				   		<CardActions>
				   			<Button
				   				variant="outlined"
				   				size="small"
				   				sx={{
				   					border: '1px solid skyblue',
				   					color: 'skyblue'
				   				}}>Beli</Button>
				   		</CardActions>
				   	</Card>
   				)
   			}
   		})}
   	</Box>
   </Container>
  )
}
