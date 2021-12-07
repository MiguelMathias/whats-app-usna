import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'

const MFSDFeedbackPage: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>MFSD Feedback</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<iframe
					src='https://docs.google.com/forms/d/e/1FAIpQLSeAiVDkYdtY4GjLDwZVPppxodBP9c5JiVk16v7IqCSiBPzuew/viewform?embedded=true'
					width='100%'
					height='100%'
					frameBorder='0'
					marginHeight={0}
					marginWidth={0}
				>
					Loading…
				</iframe>
			</IonContent>
		</IonPage>
	)
}

export default MFSDFeedbackPage
