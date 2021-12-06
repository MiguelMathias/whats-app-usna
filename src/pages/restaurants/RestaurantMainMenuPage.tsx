import { IonContent, IonPage } from '@ionic/react'
import React from 'react'
import RestaurantMenu from '../../components/restaurants/RestaurantMenu'
import RestaurantPageHeader from '../../components/restaurants/RestaurantPageHeader'
import { RestaurantBagItemModel, RestaurantModel } from '../../data/restaurants/Restaurant'

type RestaurantMainMenuPageProps = {
	restaurant: RestaurantModel
	restaurantBagItems: RestaurantBagItemModel[]
	userFavoriteItems: RestaurantBagItemModel[]
	locationUid?: string
}

const RestaurantMainMenuPage: React.FC<RestaurantMainMenuPageProps> = ({ restaurant, restaurantBagItems, userFavoriteItems, locationUid }) => (
	<IonPage>
		<RestaurantPageHeader headerText='Menu' restaurant={restaurant} locationUid={locationUid} />
		<IonContent fullscreen>
			<RestaurantMenu restaurantBagItems={restaurantBagItems} userFavoriteItems={userFavoriteItems} />
		</IonContent>
	</IonPage>
)

export default RestaurantMainMenuPage
