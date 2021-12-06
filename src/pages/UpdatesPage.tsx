import { collection, orderBy, query, where } from '@firebase/firestore'
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
import UpdateCard from '../components/UpdateCard'
import { UpdateModel } from '../data/Update'
import { firestore } from '../Firebase'
import { useSubCollection } from '../util/hooks'

type UpdatesPageProps = {
	dept: 'mfsd' | 'mwf' | 'nabsd'
}

const UpdatesPage: React.FC<UpdatesPageProps> = ({ dept }) => {
	const [updates] = useSubCollection<UpdateModel>(query(collection(firestore, 'updates'), where('dept', '==', dept), orderBy('posted', 'desc')))

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{dept.toUpperCase()} Updates</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				{updates.map((update, i) => (
					<React.Fragment key={i}>
						<UpdateCard update={update} />
					</React.Fragment>
				))}
			</IonContent>
		</IonPage>
	)
}

export default UpdatesPage
