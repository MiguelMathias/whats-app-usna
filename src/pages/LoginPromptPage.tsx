import {
	IonButtons,
	IonContent,
	IonHeader,
	IonLabel,
	IonMenuButton,
	IonPage,
	IonRouterLink,
	IonTitle,
	IonToolbar,
} from '@ionic/react'

const LoginPromptPage: React.FC = () => (
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonButtons slot='start'>
					<IonMenuButton />
				</IonButtons>
				<IonTitle>Please Log In</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent fullscreen>
			<div
				style={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 10,
				}}
			>
				<IonLabel style={{ textAlign: 'center' }}>
					You must <IonRouterLink routerLink='/account'>Log In</IonRouterLink> to order from restaurants!
				</IonLabel>
			</div>
		</IonContent>
	</IonPage>
)

export default LoginPromptPage
