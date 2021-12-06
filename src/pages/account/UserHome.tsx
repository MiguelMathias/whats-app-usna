import { signOut } from '@firebase/auth'
import { updateDoc } from '@firebase/firestore'
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonMenuButton, IonPage, IonTitle, IonToggle, IonToolbar } from '@ionic/react'
import { doc } from 'firebase/firestore'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import { UserDataModel } from '../../data/account/User'
import { auth, firestore } from '../../Firebase'
import { distinct } from '../../util/misc'

const UserHome: React.FC = () => {
	const { user, userData } = useContext(AppContext)

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Account</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<img src={user?.photoURL ?? undefined} alt='Profile Picture' style={{ borderRadius: '50%' }} />
				</div>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<IonLabel>{user?.displayName}</IonLabel>
				</div>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<IonButton onClick={() => signOut(auth)}>Log Out</IonButton>
				</div>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<IonItem>
						<IonLabel>MFSD Update Notifications</IonLabel>
						<IonToggle
							checked={userData?.subbedTopics?.includes('mfsd')}
							onIonChange={(e) => {
								if (user && userData?.subbedTopics && e.detail.checked != userData.subbedTopics.includes('mfsd'))
									updateDoc(doc(firestore, 'users', user.uid), {
										subbedTopics: e.detail.checked
											? [...(userData?.subbedTopics ?? []), 'mfsd'].filter(distinct)
											: userData?.subbedTopics?.filter((topic) => topic !== 'mfsd'),
									} as UserDataModel)
							}}
						/>
					</IonItem>
					<IonItem>
						<IonLabel>MWF Update Notifications</IonLabel>
						<IonToggle
							checked={userData?.subbedTopics?.includes('mwf')}
							onIonChange={(e) => {
								if (user && userData?.subbedTopics && e.detail.checked != userData.subbedTopics.includes('mwf'))
									updateDoc(doc(firestore, 'users', user.uid), {
										subbedTopics: e.detail.checked
											? [...(userData?.subbedTopics ?? []), 'mwf'].filter(distinct)
											: userData?.subbedTopics?.filter((topic) => topic !== 'mwf'),
									} as UserDataModel)
							}}
						/>
					</IonItem>
					<IonItem>
						<IonLabel>NABSD Update Notifications</IonLabel>
						<IonToggle
							checked={userData?.subbedTopics?.includes('nabsd')}
							onIonChange={(e) => {
								if (user && userData?.subbedTopics && e.detail.checked != userData.subbedTopics.includes('nabsd'))
									updateDoc(doc(firestore, 'users', user.uid), {
										subbedTopics: e.detail.checked
											? [...(userData?.subbedTopics ?? []), 'nabsd'].filter(distinct)
											: userData?.subbedTopics?.filter((topic) => topic !== 'nabsd'),
									} as UserDataModel)
							}}
						/>
					</IonItem>
				</div>
			</IonContent>
		</IonPage>
	)
}
export default UserHome
