import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react'
import { RestaurantModel } from '../../data/restaurants/Restaurant'
import RestaurantInfoButton from './RestaurantInfoButton'

type RestaurantPageHeaderProps = {
	headerText: string
	restaurant: RestaurantModel
}

const RestaurantPageHeader: React.FC<RestaurantPageHeaderProps> = ({ headerText, restaurant }) => (
	<IonHeader>
		<IonToolbar>
			<IonButtons slot='start'>
				<IonMenuButton />
			</IonButtons>
			<IonTitle>{restaurant.name}</IonTitle>
			<RestaurantInfoButton slot='end' restaurant={restaurant} />
		</IonToolbar>
	</IonHeader>
)

export default RestaurantPageHeader
