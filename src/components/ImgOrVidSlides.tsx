import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons'
import Carousel from 'nuka-carousel'
import React, { useState } from 'react'
import { isDesktop } from '../util/platform'
import VidSlide from './VidSlide'

type ImgSlidesProps = {
	slideSrcs: string[]
	maxImgHeight?: number
}

const ImgOrVidSlides: React.FC<ImgSlidesProps> = ({ slideSrcs, maxImgHeight }) => {
	const [slideIndex, setSlideIndex] = useState(0)

	return slideSrcs.length > 0 ? (
		<Carousel
			slideIndex={slideIndex}
			afterSlide={(slideIndex) => setSlideIndex(slideIndex)}
			renderCenterLeftControls={({ previousSlide }) =>
				isDesktop && slideSrcs.length > 1 ? (
					<IonButtons>
						<IonButton disabled={slideIndex === 0} shape='round' fill='solid' color='light' onClick={previousSlide}>
							<IonIcon slot='icon-only' color='dark' icon={chevronBackOutline} />
						</IonButton>
					</IonButtons>
				) : undefined
			}
			renderCenterRightControls={({ nextSlide }) =>
				isDesktop && slideSrcs.length > 1 ? (
					<IonButtons>
						<IonButton disabled={slideIndex === slideSrcs.length - 1} shape='round' fill='solid' color='light' onClick={nextSlide}>
							<IonIcon slot='icon-only' color='dark' icon={chevronForwardOutline} />
						</IonButton>
					</IonButtons>
				) : undefined
			}
			enableKeyboardControls={isDesktop}
			heightMode='current'
		>
			{slideSrcs.map((slideSrc, i) => (
				<React.Fragment key={i}>
					{slideSrc.includes('-vid') ? (
						<VidSlide maxImgHeight={maxImgHeight} slideSrc={slideSrc} />
					) : (
						<img
							style={{
								maxHeight: maxImgHeight || undefined,
								objectFit: 'cover',
								width: '100%',
								height: '100%',
								cursor: 'all-scroll',
							}}
							src={slideSrc}
						/>
					)}
				</React.Fragment>
			))}
		</Carousel>
	) : (
		<></>
	)
}

export default ImgOrVidSlides
