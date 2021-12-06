import { doc } from '@firebase/firestore'
import { getDownloadURL, listAll, ref } from '@firebase/storage'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import ImgOrVidSlides from '../components/ImgOrVidSlides'
import { UpdateModel } from '../data/Update'
import { firestore, storage } from '../Firebase'
import { useSubDoc } from '../util/hooks'

type UpdatePageProps = {
	dept: 'mfsd' | 'mwf' | 'nabsd'
}

const UpdatePage: React.FC<UpdatePageProps> = ({ dept }) => {
	const { updateUid } = useParams<{ updateUid: string }>()
	const [update] = useSubDoc<UpdateModel>(doc(firestore, 'updates', updateUid))
	const [srcs, setSrcs] = useState<string[]>([])
	useEffect(() => {
		if (update)
			listAll(ref(storage, `/updates/${update.uid}/media`)).then(async ({ items }) =>
				setSrcs(await Promise.all(items.map(async (item) => getDownloadURL(item))))
			)
	}, [update?.uid])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref={`/${dept}/updates`} />
					</IonButtons>
					<IonTitle>
						{dept.toUpperCase()}: {update?.title}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<ImgOrVidSlides slideSrcs={srcs} />
				<IonList lines='none'>
					<IonItem>
						<p style={{ whiteSpace: 'pre-wrap' }}>{update?.caption}</p>
					</IonItem>
					<IonItem>
						<p slot='end'>{update?.posted?.toDate().toLocaleDateString()}</p>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	)
}

export default UpdatePage
