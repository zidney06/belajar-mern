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

export default function ProductList ({header}) {
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
	   	{books.map((book, i) => (
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
	   	))}
   	</Box>
   </Container>
  )
}

const books = [
	{
		title: 'Buku Sejarah',
		author: 'Atin',
		price: 12000,
		ISBN: '123-234-345',
		image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	},
	{
		title: 'Buku Tulis',
		author: 'Mia ni',
		price: 17500,
		ISBN: '123-234-345',
		image: "https://media.istockphoto.com/id/1180068638/photo/open-book-on-autumn-grass-and-fallen-leaves.webp?a=1&s=612x612&w=0&k=20&c=nXxQurwM2YNEWkRU2fwq0H0WZJRusdnyEpnpI0Poxd4="
	},
	{
		title: 'Buku Sosial',
		author: 'Andik',
		price: 23000,
		ISBN: '123-234-345',
		image: "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	},
	{
		title: 'Buku Sejarah',
		author: 'Atin',
		price: 12000,
		ISBN: '123-234-345',
		image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	},
	{
		title: 'Buku Tulis',
		author: 'Mia ni',
		price: 17500,
		ISBN: '123-234-345',
		image: "https://media.istockphoto.com/id/1180068638/photo/open-book-on-autumn-grass-and-fallen-leaves.webp?a=1&s=612x612&w=0&k=20&c=nXxQurwM2YNEWkRU2fwq0H0WZJRusdnyEpnpI0Poxd4="
	},
	{
		title: 'Buku Sosial',
		author: 'Andik',
		price: 23000,
		ISBN: '123-234-345',
		image: "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	}
]