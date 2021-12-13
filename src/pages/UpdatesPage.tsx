import { collection, orderBy, query, where } from '@firebase/firestore'
import { IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import React, { useState } from 'react'
import UpdateCard from '../components/UpdateCard'
import { UpdateModel } from '../data/Update'
import { firestore } from '../Firebase'
import { useSubCollection } from '../util/hooks'
import { distinct } from '../util/misc'

type UpdatesPageProps = {
	dept: 'mfsd' | 'mwf' | 'nabsd'
}

const UpdatesPage: React.FC<UpdatesPageProps> = ({ dept }) => {
	const [categories, setCategories] = useState<string[]>([])
	const [updates] = useSubCollection<UpdateModel>(query(collection(firestore, 'updates'), where('dept', '==', dept), orderBy('posted', 'desc')))
	const allCategories = () => updates.map((update) => update.category).filter(distinct)
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
				{allCategories().length > 0 && (
					<IonItem>
						<IonLabel>Category</IonLabel>
						<IonSelect multiple slot='end' value={categories} onIonChange={(e) => setCategories(e.detail.value)}>
							{allCategories().map((cat, i) => (
								<IonSelectOption key={i} value={cat}>
									{cat}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
				)}
				{updates
					.filter((update) => (categories.length > 0 ? categories.includes(update.category ?? '') : true))
					.map((update, i) => (
						<React.Fragment key={i}>
							<UpdateCard update={update} />
						</React.Fragment>
					))}
			</IonContent>
		</IonPage>
	)
}

export default UpdatesPage
