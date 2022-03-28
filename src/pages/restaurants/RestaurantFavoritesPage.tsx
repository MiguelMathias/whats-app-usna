import { IonContent, IonPage } from '@ionic/react'
import RestaurantMenu from '../../components/restaurants/RestaurantMenu'
import RestaurantPageHeader from '../../components/restaurants/RestaurantPageHeader'
import { RestaurantBagItemModel, RestaurantModel } from '../../data/restaurants/Restaurant'

type RestaurantFavoritesPageProps = {
	restaurant: RestaurantModel
	userFavoriteItems: RestaurantBagItemModel[]
	locationUid?: string
}

const RestaurantFavoritesPage: React.FC<RestaurantFavoritesPageProps> = ({
	restaurant,
	userFavoriteItems,
	locationUid,
}) => {
	return (
		<IonPage>
			<RestaurantPageHeader headerText='Favorites' restaurant={restaurant} locationUid={locationUid} />
			<IonContent fullscreen>
				<RestaurantMenu restaurantBagItems={userFavoriteItems} userFavoriteItems={userFavoriteItems} />
			</IonContent>
		</IonPage>
	)
}

export default RestaurantFavoritesPage
