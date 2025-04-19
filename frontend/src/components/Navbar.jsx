import {
	Box,
	Container,
	TextField,
	createTheme,
	Button,
	Grid,
	Typography
} from '@mui/material'
import {CiSearch} from 'react-icons/ci'
import {GiHamburgerMenu} from 'react-icons/gi'

export default function Navbar() {
	
	return (
	<Container component="nav" disableGutters maxWidth="xl" sx={{
		display: 'flex',
		justifyContent: 'space-between',
		bgcolor: '#213555',
		color: '#fff',
		m: 0,
		width: '100%'
	}}>
		<Box component="section" 
			sx={{
				mr: 2,
				display: 'flex',
				alignItems: 'center'
			}}>
			<Button
				variant="text"
				fullWidth
				color="text.primary"
				sx={{
					fontSize: 25,
					height: '60%',
					color: '#fff'
				}}>
				<GiHamburgerMenu />
			</Button>
		</Box>
		<Box
			component="section"
			sx={{
				flexGrow: 1,
				width: '100%',
				py: {
					xs: 0,
					md: .5
				},
				pb: {
					xs: .5
				}
			}}>
			<Grid container>
				<Grid
					size={{xs: 12, md: 6}}
					sx={{
						px: 3
					}}>
					<Box>
						<Typography variant="h4">Toko Buku Al-Hidayah</Typography>
					</Box>
				</Grid>
				<Grid
					size={{xs: 12, md: 6}} 
					sx={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: {
							xs: undefined,
							md: 'row-reverse'
						}
					}}>
					<Box sx={{
						width: {
							xs: '100%',
							md: '70%'
						},
						display: 'flex',
						alignItems: 'center',
						px: 1
					}}>
						<TextField
							sx={{
								width: '100%'
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
							}}>
							<CiSearch className="search-icon" />
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Box>
	</Container>
	)
}