import { IonSelect, IonSelectOption, IonTitle } from '@ionic/react'
import { RestaurantModel } from '../../data/restaurants/Restaurant'

type RestaurantPageHeaderTitleProps = {
	restaurant: RestaurantModel
	headerText: string
	locationName: string
	setLocationName: (locationName: string) => void
}

const RestaurantPageHeaderTitle: React.FC<RestaurantPageHeaderTitleProps> = ({
	restaurant,
	headerText,
	locationName,
	setLocationName,
}) => (
	<IonTitle>
		{restaurant.locations.length > 0 ? (
			<IonSelect
				value={[restaurant.name, locationName, headerText].join(' ')}
				onIonChange={(e) => setLocationName(e.detail.value)}
			>
				{restaurant.locations.map((loc, i) => (
					<IonSelectOption key={i} value={loc.name}>
						{loc.name}
					</IonSelectOption>
				))}
			</IonSelect>
		) : (
			<IonTitle>{restaurant.name}</IonTitle>
		)}
	</IonTitle>
)
export default RestaurantPageHeaderTitle
