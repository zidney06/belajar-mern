import {
	Container
} from '@mui/material'

export default function HomePage() {
	return (
	<>
		<Container sx={{
			border: '1px solid red',
			p: 0,
			m: 0
		}}
		className="tes"
		disableGutters
		maxWidth="xl"
		>
			Home page
		</Container>
	</>
	)
}