import { IonButtons, IonHeader, IonMenuButton, IonToolbar } from '@ionic/react'
import { RestaurantModel } from '../../data/restaurants/Restaurant'
import RestaurantInfoButton from './RestaurantInfoButton'
import RestaurantPageHeaderTitle from './RestaurantPageHeaderTitle'

type RestaurantPageHeaderProps = {
	headerText: string
	restaurant: RestaurantModel
	locationName: string
	setLocationName: (locationName: string) => void
}

const RestaurantPageHeader: React.FC<RestaurantPageHeaderProps> = ({
	headerText,
	restaurant,
	locationName,
	setLocationName,
}) => (
	<IonHeader>
		<IonToolbar>
			<IonButtons slot='start'>
				<IonMenuButton />
			</IonButtons>
			<RestaurantPageHeaderTitle
				restaurant={restaurant}
				headerText={headerText}
				locationName={locationName}
				setLocationName={setLocationName}
			/>
			<RestaurantInfoButton slot='end' restaurant={restaurant} />
		</IonToolbar>
	</IonHeader>
)

export default RestaurantPageHeader
