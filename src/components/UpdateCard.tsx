import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonRouterLink } from '@ionic/react'
import { getDownloadURL, listAll, ref } from 'firebase/storage'
import { Markup } from 'interweave'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { updateCaptionHTML } from '../data/mfsd/MFSD'
import { UpdateModel } from '../data/Update'
import { storage } from '../Firebase'
import ImgOrVidSlides from './ImgOrVidSlides'
import './UpdateCard.scss'

type UpdateCardProps = {
	update: UpdateModel
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
	const [srcs, setSrcs] = useState<string[]>([])
	const location = useLocation()

	useEffect(() => {
		listAll(ref(storage, `/updates/${update.uid}/media`)).then(async ({ items }) =>
			setSrcs(await Promise.all(items.map(async (item) => getDownloadURL(item))))
		)
	}, [update.uid])

	return (
		<IonCard>
			<ImgOrVidSlides slideSrcs={srcs} />
			<IonCardHeader>
				<IonRouterLink routerLink={location.pathname + `/${update.uid}`}>
					<IonCardTitle>{update.title}</IonCardTitle>
				</IonRouterLink>
			</IonCardHeader>
			<IonCardContent>
				<IonLabel style={{ whitespace: 'pre-wrap' }} class='ion-text-wrap'>
					<div style={{ whiteSpace: 'pre-wrap' }}>
						<Markup content={updateCaptionHTML(update.caption)} />
					</div>
				</IonLabel>
			</IonCardContent>
		</IonCard>
	)
}

export default UpdateCard
