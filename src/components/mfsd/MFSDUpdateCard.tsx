import { getDownloadURL, listAll, ref } from '@firebase/storage'
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel } from '@ionic/react'
import { Markup } from 'interweave'
import { useEffect, useState } from 'react'
import { updateCaptionHTML, UpdatePost } from '../../data/mfsd/MFSD'
import { storage } from '../../Firebase'
import ImgOrVidSlides from '../ImgOrVidSlides'

type MFSDUpdateCardProps = {
	update: UpdatePost
}

const MFSDUpdateCard: React.FC<MFSDUpdateCardProps> = ({ update }) => {
	const [srcs, setSrcs] = useState<string[]>([])
	useEffect(() => {
		listAll(ref(storage, `/mfsd/updates/${update.updateUid}/media`)).then(async ({ items }) =>
			setSrcs(await Promise.all(items.map(async (item) => getDownloadURL(item))))
		)
	}, [update.updateUid])

	return (
		<IonCard>
			<ImgOrVidSlides slideSrcs={srcs} />
			<IonCardHeader>
				<IonCardTitle>{update.title}</IonCardTitle>
			</IonCardHeader>
			<IonCardContent>
				<IonLabel style={{ whitespace: 'pre-wrap' }} class='ion-text-wrap'>
					<div style={{ whiteSpace: 'pre-wrap' }}>
						<Markup content={updateCaptionHTML(update.caption)} />
					</div>
				</IonLabel>
				<br />
				<IonLabel>
					{update.instaPostId ? (
						<a href={`https://www.instagram.com/p/${update.instaPostId}`} target='_blank'>
							{update.posted?.toDate().toLocaleDateString()}
						</a>
					) : (
						update.posted?.toDate().toLocaleDateString()
					)}
				</IonLabel>
			</IonCardContent>
		</IonCard>
	)
}

export default MFSDUpdateCard
