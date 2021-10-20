import { signOut } from '@firebase/auth'
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonLabel,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import { auth } from '../../Firebase'

const UserHome: React.FC = () => {
	const { user } = useContext(AppContext)

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
			<IonContent>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<img src={user?.photoURL ?? undefined} alt='Profile Picture' style={{ borderRadius: '50%' }} />
				</div>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<IonLabel>{user?.displayName}</IonLabel>
				</div>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<IonButton onClick={() => signOut(auth)}>Log Out</IonButton>
				</div>
			</IonContent>
		</IonPage>
	)
}
export default UserHome
