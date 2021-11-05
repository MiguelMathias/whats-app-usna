import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonSpinner,
	IonTitle,
	IonToolbar,
} from '@ionic/react'

const LoadingPage: React.FC = () => (
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonButtons slot='start'>
					<IonMenuButton />
				</IonButtons>
				<IonTitle>Loading...</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent fullscreen>
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<IonSpinner />
			</div>
		</IonContent>
	</IonPage>
)

export default LoadingPage
