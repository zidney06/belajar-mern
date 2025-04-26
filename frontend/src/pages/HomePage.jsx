import {useState} from 'react'
import Slider from 'react-slick';
import ProductList from '../components/ProductList'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {FaInstagram, FaYoutube} from 'react-icons/fa'

//kalau bisa ganti library untuk mmebuat carousel

export default function HomePage() {

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
		<div className="container-fluid p-0">
			<div className="w-75 mx-auto tes my-5">
				<Slider {...settings}>
	 				<div className="slide">
	 					<img src="https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="slide" />
	 		    </div>
	 		    <div className="slide">
	 		    	<img src="https://media.istockphoto.com/id/1180068638/photo/open-book-on-autumn-grass-and-fallen-leaves.webp?a=1&s=612x612&w=0&k=20&c=nXxQurwM2YNEWkRU2fwq0H0WZJRusdnyEpnpI0Poxd4=" className="slide" />
		 	    </div>
	 		    <div className="slide">
	 		    	<img src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="slide" />
	 		    </div>
	      </Slider>
			</div>
			<main className="px-2">
				<ProductList header="Komik" tag="komik" />
				<ProductList header="Majalah" tag="majalah" />
				<ProductList header="Baru terbit" tag="baru" />	
			</main>
			<footer className="bg-primary container-fluid text-light row p-3">
				<div className="col text-center mb-0">
					<h3 className="mb-0">
						<FaInstagram />
						@Toko Al-Hidayah
					</h3>
				</div>
				<div className="col text-center">
					<h3 className="mb-0">
						<FaYoutube />
						@Toko Al-Hidayah
					</h3>
				</div>
			</footer>
		</div>	
	)
}