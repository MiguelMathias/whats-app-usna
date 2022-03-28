import { useRef } from 'react'
import { useIntersection } from 'react-use'

type VidSlideProps = {
	maxImgHeight?: number
	slideSrc: string
}

const VidSlide: React.FC<VidSlideProps> = ({ maxImgHeight, slideSrc }) => {
	const vidRef = useRef<HTMLVideoElement>(null)
	const intersection = useIntersection(vidRef, { root: null, rootMargin: '0px', threshold: 0.5 })

	return (
		<div>
			<video
				onClick={() => {
					const videos = document.getElementsByTagName('video')
					for (let i = 0; i < videos.length; i++) videos[i].muted = !videos[i].muted
				}}
				loop
				muted
				ref={vidRef}
				autoPlay={intersection?.isIntersecting}
				style={{
					maxHeight: maxImgHeight || undefined,
					objectFit: 'cover',
					width: '100%',
					height: '100%',
					cursor: 'all-scroll',
				}}
				src={slideSrc}
				//controls
			/>
		</div>
	)
}

export default VidSlide
