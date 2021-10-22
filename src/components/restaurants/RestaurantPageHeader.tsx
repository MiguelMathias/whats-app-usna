import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react'
import { RestaurantModel } from '../../data/restaurants/Restaurant'
import RestaurantInfoButton from './RestaurantInfoButton'

type RestaurantPageHeaderProps = {
	headerText: string
	restaurant: RestaurantModel
	locationUid?: string
}

const RestaurantPageHeader: React.FC<RestaurantPageHeaderProps> = ({ headerText, restaurant, locationUid }) => {
	const locationName = restaurant.locations.find((location) => location.uid === locationUid)?.name
	return (
		<IonHeader>
			<IonToolbar>
				<IonButtons slot='start'>
					<IonMenuButton />
				</IonButtons>
				<IonTitle>
					{restaurant.name + (locationName ? ` ${locationName}` : '')} {headerText}
				</IonTitle>
				<RestaurantInfoButton slot='end' restaurant={restaurant} />
			</IonToolbar>
		</IonHeader>
	)
}

export default RestaurantPageHeader
