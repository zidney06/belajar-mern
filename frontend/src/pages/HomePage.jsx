import {useState} from 'react'
import Slider from 'react-slick';
import ProductList from '../components/ProductList'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
	Container,
	Box,
	Typography
} from '@mui/material'
import {FaInstagram, FaYoutube} from 'react-icons/fa'

//kalau bisa ganti library untuk mmebuat carousel

export default function HomePage() {
	const [imgUrl, setImageUrl] = useState([
		"https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://media.istockphoto.com/id/1180068638/photo/open-book-on-autumn-grass-and-fallen-leaves.webp?a=1&s=612x612&w=0&k=20&c=nXxQurwM2YNEWkRU2fwq0H0WZJRusdnyEpnpI0Poxd4=",
		"https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	])

	const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3500,
    accessbility: false
  }

	return (
	<>
		<Container
			className="tes"
			disableGutters
			maxWidth="xl">
			<Box
				sx={{
					p: 1.5
				}}>
				<Box
					sx={{
						width: '75%',
						margin: 'auto',
						p: 1.5
					}}>
					<Box
					sx={{
						borderRadius: 5,
						overflow: 'hidden',
						height: 320,
					}}>
						<Slider {...settings}>
			        {imgUrl.map((url, i) => (
					      <div>
					      	<img src={url} className="slide" />
					      </div>
			        	)
			        )}
		        </Slider>
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					my: 1
				}}>
				<ProductList header="Baru Terbit" />
			</Box>

			<Box
				sx={{
					my: 1
				}}>
				<ProductList header="Komik dan Manga" />
			</Box>

			<Box
				component="footer"
				sx={{
					textAlign: 'center',
					p: 1,
					bgcolor: '#213555',
					color: '#fff'
				}}>
				<Typography variant="h6">Contact us</Typography>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center'
					}}>
					<Box
						sx={{
							width: '45%',
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						<FaInstagram className="footer-icon" />
						@Al-Hidayah
					</Box>
					<Box
						sx={{
							width: '45%',
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						<FaYoutube className="footer-icon" />
						@Al-Hidayah
					</Box>
				</Box>
			</Box>
		</Container>
	</>
	)
}