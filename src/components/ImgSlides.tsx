import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons'
import Carousel from 'nuka-carousel'
import { useState } from 'react'
import { isDesktop } from '../util/platform'

type ImgSlidesProps = {
	picSrcs: string[]
	maxImgHeight?: number
}

const ImgSlides: React.FC<ImgSlidesProps> = ({ picSrcs, maxImgHeight }) => {
	const [slideIndex, setSlideIndex] = useState(0)
	return picSrcs.length > 0 ? (
		<Carousel
			slideIndex={slideIndex}
			afterSlide={(slideIndex) => setSlideIndex(slideIndex)}
			renderCenterLeftControls={({ previousSlide }) =>
				isDesktop ? (
					<IonButtons>
						<IonButton disabled={slideIndex === 0} shape='round' fill='solid' color='light' onClick={previousSlide}>
							<IonIcon slot='icon-only' color='dark' icon={chevronBackOutline} />
						</IonButton>
					</IonButtons>
				) : undefined
			}
			renderCenterRightControls={({ nextSlide }) =>
				isDesktop ? (
					<IonButtons>
						<IonButton disabled={slideIndex === picSrcs.length - 1} shape='round' fill='solid' color='light' onClick={nextSlide}>
							<IonIcon slot='icon-only' color='dark' icon={chevronForwardOutline} />
						</IonButton>
					</IonButtons>
				) : undefined
			}
			enableKeyboardControls={isDesktop}
			heightMode='current'
		>
			{picSrcs.map((picSrc, i) => (
				<img
					key={i}
					style={{
						maxHeight: maxImgHeight || 300,
						objectFit: 'cover',
						width: '100%',
						height: '100%',
						cursor: 'all-scroll',
						//position: 'absolute',
						//top: 0,
						//left: 0,
					}}
					src={picSrc}
				/>
			))}
		</Carousel>
	) : (
		<></>
	)
}

export default ImgSlides
