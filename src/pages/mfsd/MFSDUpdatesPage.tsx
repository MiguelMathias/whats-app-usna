import { collection, orderBy, query } from '@firebase/firestore'
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
import MFSDUpdateCard from '../../components/mfsd/MFSDUpdateCard'
import { UpdatePost } from '../../data/mfsd/MFSD'
import { firestore } from '../../Firebase'
import { useSubCollection } from '../../util/hooks'

const MFSDUpdatesPage: React.FC = () => {
	const [updates] = useSubCollection<UpdatePost>(query(collection(firestore, 'mfsd'), orderBy('posted', 'desc'), orderBy('updateUid')))

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>MFSD Updates</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				{updates.map((update, i) => (
					<React.Fragment key={i}>
						<MFSDUpdateCard update={update} />
					</React.Fragment>
				))}
			</IonContent>
		</IonPage>
	)
}

export default MFSDUpdatesPage
