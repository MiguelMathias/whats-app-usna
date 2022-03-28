import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react'
import { useState } from 'react'

const MFSDFeedbackPage: React.FC = () => {
	const [form, setForm] = useState<'feedback' | 'mealeval'>('feedback')
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>MFSD Feedback</IonTitle>
				</IonToolbar>
				<IonToolbar>
					<IonSegment
						value={form}
						onIonChange={(e) => setForm(e.detail.value === 'feedback' ? 'feedback' : e.detail.value === 'mealeval' ? 'mealeval' : 'feedback')}
					>
						<IonSegmentButton value='feedback'>Feedback</IonSegmentButton>
						<IonSegmentButton value='mealeval'>Meal Evaluation</IonSegmentButton>
					</IonSegment>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<iframe
					src={
						form === 'feedback'
							? 'https://docs.google.com/forms/d/e/1FAIpQLSdbOfm_RUJEUqoCQ1cNhkTO_EnK8THq1YOWzFCt5RE8NvX1Tg/viewform'
							: 'https://docs.google.com/forms/d/e/1FAIpQLSeAiVDkYdtY4GjLDwZVPppxodBP9c5JiVk16v7IqCSiBPzuew/viewform?embedded=true'
					}
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
