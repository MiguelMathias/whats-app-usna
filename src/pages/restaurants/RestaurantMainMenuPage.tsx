import { IonContent, IonPage } from '@ionic/react'
import React from 'react'
import RestaurantMenu from '../../components/restaurants/RestaurantMenu'
import RestaurantPageHeader from '../../components/restaurants/RestaurantPageHeader'
import { RestaurantBagItemModel, RestaurantItemModel, RestaurantModel } from '../../data/restaurants/Restaurant'

type RestaurantMainMenuPageProps = {
	restaurant: RestaurantModel
	restaurantItems: RestaurantItemModel[]
	locationName: string
	setLocationName: (location: string) => void
}

const RestaurantMainMenuPage: React.FC<RestaurantMainMenuPageProps> = ({
	restaurant,
	restaurantItems,
	locationName,
	setLocationName,
}) => (
	<IonPage>
		<RestaurantPageHeader
			headerText='Menu'
			restaurant={restaurant}
			locationName={locationName}
			setLocationName={setLocationName}
		/>
		<IonContent>
			<RestaurantMenu
				restaurant={restaurant}
				restaurantBagItems={restaurantItems.map(
					(restaurantItem) =>
						({
							restaurantItem,
							note: '',
							uid: '',
						} as RestaurantBagItemModel)
				)}
			/>
		</IonContent>
	</IonPage>
)

export default RestaurantMainMenuPage
