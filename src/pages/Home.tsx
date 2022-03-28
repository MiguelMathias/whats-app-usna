import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import FeaturesWaiting from '../components/FeaturesWaiting'
import './Home.css'

type HomePlaceholderProps = {
	title?: string
}

const HomePlaceholder: React.FC<HomePlaceholderProps> = ({ title }) => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{title ?? 'Home'}</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<FeaturesWaiting />
			</IonContent>
		</IonPage>
	)
}

export default HomePlaceholder
