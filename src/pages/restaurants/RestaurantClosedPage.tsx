import { IonContent, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { RestaurantModel } from '../../data/restaurants/Restaurant'

type RestaurantClosedPageProps = {
	restaurant: RestaurantModel
}

const RestaurantClosedPage: React.FC<RestaurantClosedPageProps> = ({ restaurant }) => (
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonMenuButton />
				<IonTitle>{restaurant.name} Closed</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent>
			<div
				style={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 10,
				}}
			>
				<IonLabel style={{ textAlign: 'center' }}>{restaurant.name} is closed at this time! Please check again later.</IonLabel>
			</div>
		</IonContent>
	</IonPage>
)

export default RestaurantClosedPage
