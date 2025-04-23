import Navbar from '../components/Navbar'
import {
	Container,
	Box,
	Typography
} from '@mui/material'

export default function CreatePage() {
	return (
	<Container disableGutters>
		<Navbar />
		<Box>
			<Box
				sx={{
					textAlign: 'center',
					display: "flex",
					justifyContent: "center"
				}}>
				<Box
					sx={{
						width: 500,
						border: '1px solid red'
					}}>
				<Typography variant="h5">Membuat data</Typography>	
				</Box>
			</Box>
			<Box></Box>
		</Box>
	</Container>
	)
}