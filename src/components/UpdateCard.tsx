import { getDownloadURL, listAll, ref } from '@firebase/storage'
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonRouterLink } from '@ionic/react'
import { Markup } from 'interweave'
import { useEffect, useState } from 'react'
import { updateCaptionHTML } from '../data/mfsd/MFSD'
import { UpdateModel } from '../data/Update'
import { storage } from '../Firebase'
import ImgOrVidSlides from './ImgOrVidSlides'

type UpdateCardProps = {
	update: UpdateModel
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
	const [srcs, setSrcs] = useState<string[]>([])
	useEffect(() => {
		listAll(ref(storage, `/updates/${update.uid}/media`)).then(async ({ items }) =>
			setSrcs(await Promise.all(items.map(async (item) => getDownloadURL(item))))
		)
	}, [update.uid])

	return (
		<IonCard>
			<ImgOrVidSlides slideSrcs={srcs} />
			<IonCardHeader>
				<IonRouterLink routerLink={`/${update.dept}/updates/${update.uid}`}>
					<IonCardTitle>{update.title}</IonCardTitle>
				</IonRouterLink>
			</IonCardHeader>
			<IonCardContent>
				<IonLabel style={{ whitespace: 'pre-wrap' }} class='ion-text-wrap'>
					<div style={{ whiteSpace: 'pre-wrap' }}>
						<Markup content={updateCaptionHTML(update.caption)} />
					</div>
				</IonLabel>
				<br />
				<div style={{ textAlign: 'right' }}>
					<IonLabel>
						{update.instaPostId ? (
							<a href={`https://www.instagram.com/p/${update.instaPostId}`} target='_blank'>
								{update.posted?.toDate().toLocaleDateString()}
							</a>
						) : (
							update.posted?.toDate().toLocaleDateString()
						)}
					</IonLabel>
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default UpdateCard
