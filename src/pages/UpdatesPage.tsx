import { collection, orderBy, where } from '@firebase/firestore'
import { IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import { query } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { AppContext } from '../AppContext'
import UpdateCard from '../components/UpdateCard'
import { UpdateModel } from '../data/Update'
import { firestore } from '../Firebase'
import { useSubCollection } from '../util/hooks'
import { distinct, getAlpha } from '../util/misc'

type UpdatesPageProps = {
	dept: string
	filterForUser?: boolean
	title?: string
}

const UpdatesPage: React.FC<UpdatesPageProps> = ({ dept, filterForUser, title }) => {
	const { user, userData } = useContext(AppContext)
	const userQueryArray = ['all']
	if (user?.email) userQueryArray.push(user.email)
	if (userData?.company) userQueryArray.push(userData.company.toString())
	const updatesQuery = filterForUser
		? query(collection(firestore, 'updates'), where('midsAndCos', 'array-contains-any', userQueryArray), orderBy('posted', 'desc'))
		: query(collection(firestore, 'updates'), where('dept', '==', dept), orderBy('posted', 'desc'))

	const [updates] = useSubCollection<UpdateModel>(updatesQuery)

	const allCategories = () => updates.map((update) => update.category).filter(distinct)
	const [categories, setCategories] = useState<string[]>([])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{title ?? `${dept.toUpperCase()} Updates`}</IonTitle>
				</IonToolbar>
			</IonHeader>
			{updates.length === 0 ? (
				<IonContent>
					<div style={{ minHeight: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
						<p>No updates right now! Come back later.</p>
					</div>
				</IonContent>
			) : (
				<IonContent>
					{allCategories().length > 0 && (
						<IonItem color='light'>
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
								<div className='separation-div' />
								<UpdateCard update={update} />
							</React.Fragment>
						))}
				</IonContent>
			)}
		</IonPage>
	)
}

export default UpdatesPage
