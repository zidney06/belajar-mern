import {
	Box,
	Container,
	TextField,
	createTheme,
	ThemeProvider,
	Button
} from '@mui/material'
import {CiSearch} from 'react-icons/ci'
import {GiHamburgerMenu} from 'react-icons/gi'

export default function Navbar() {
	
	return (
	<Container component="nav" disableGutters sx={{
		display: 'flex',
		justifyContent: 'space-between',
		bgcolor: '#213555',
		color: '#fff',
		pl: 1.5
	}}>
		<Box component="section" sx={{mr: 2}} >
			<Button
				variant="text"
				fullWidth
				color="text.primary"
				sx={{
					fontSize: 25,
					height: '100%',
					color: '#fff'
				}}
			>
				<GiHamburgerMenu />
			</Button>
		</Box>
		<Box
			component="section"
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '100%'
			}}
		>
			<Box sx={{
				width: 1/3
			}}>
				<h1>Toko Buku</h1>
			</Box>
			<Box sx={{
				width: 1/3,
				display: 'flex',
				alignItems: 'center'
			}}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center'
					}}
				>
					<TextField
						sx={{
							width: 4/5
						}}
						size="small"
						color="primary.main"
						className="search"
						placeholder="Search"
					/>
					
					<Button
						variant="text"
						size="small"
						color="text.primary"
						sx={{
							fontSize: 10,
							height: '100%',
							color: '#fff'
						}}
					>
						<CiSearch className="search-icon" />
					</Button>
				</Box>
			</Box>
		</Box>
	</Container>
	)
}