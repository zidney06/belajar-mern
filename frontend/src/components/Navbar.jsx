import {
	Box,
	Container,
	TextField,
	createTheme,
	Button,
	Grid,
	Typography,
	Collapse
} from '@mui/material'
import {Link} from 'react-router-dom'
import {useState} from 'react'
import {CiSearch} from 'react-icons/ci'
import {GiHamburgerMenu} from 'react-icons/gi'

export default function Navbar() {
	const [cheked, setCheked] = useState(false)

	return (
	<Container
		component="nav"
		disableGutters
		maxWidth="xl"
		sx={{
			bgcolor: '#213555',
			color: '#fff',
			width: '100%'
		}}>
		<Box
		 sx={{
		 	display: 'flex',
			bgcolor: '#213555',
			color: '#fff',
			m: 0,
			width: '100%'
		 }}>
			<Box component="section" 
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '15vw'
				}}>
				<Button
					variant="text"
					fullWidth
					color="text.primary"
					onClick={() => cheked ? setCheked(false): setCheked(true)}
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
		</Box>
		<Collapse in={cheked} sx={{
			position: 'absolute',
			width: '100%',
			bgcolor: '#213555',
			zIndex: 1
		}}>
			<Link className="link" to="/">home page</Link>
			<Link className="link" to="/create">create page</Link>
		</Collapse>
	</Container>
	)
}