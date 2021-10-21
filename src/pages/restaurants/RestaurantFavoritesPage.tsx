import { IonContent, IonPage } from '@ionic/react'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import RestaurantMenu from '../../components/restaurants/RestaurantMenu'
import RestaurantPageHeader from '../../components/restaurants/RestaurantPageHeader'
import { RestaurantModel } from '../../data/restaurants/Restaurant'

type RestaurantFavoritesPageProps = {
	restaurant: RestaurantModel
}

const RestaurantFavoritesPage: React.FC<RestaurantFavoritesPageProps> = ({ restaurant }) => {
	const { userFavorites } = useContext(AppContext)
	return (
		<IonPage>
			<RestaurantPageHeader headerText='Favorites' restaurant={restaurant} />
			<IonContent>
				<RestaurantMenu
					restaurant={restaurant}
					restaurantBagItems={userFavorites.filter((restaurantBagItem) => restaurantBagItem.restaurantItem.restaurantUid === restaurant.uid)}
				/>
			</IonContent>
		</IonPage>
	)
}

export default RestaurantFavoritesPage
