import { IonContent, IonPage } from '@ionic/react'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import RestaurantMenu from '../../components/restaurants/RestaurantMenu'
import RestaurantPageHeader from '../../components/restaurants/RestaurantPageHeader'
import { RestaurantModel } from '../../data/restaurants/Restaurant'

type RestaurantFavoritesPageProps = {
	restaurant: RestaurantModel
	locationName: string
	setLocationName: (locationName: string) => void
}

const RestaurantFavoritesPage: React.FC<RestaurantFavoritesPageProps> = ({
	restaurant,
	locationName,
	setLocationName,
}) => {
	const { userFavorites } = useContext(AppContext)
	return (
		<IonPage>
			<RestaurantPageHeader
				headerText='Favorites'
				restaurant={restaurant}
				locationName={locationName}
				setLocationName={setLocationName}
			/>
			<IonContent>
				<RestaurantMenu
					restaurant={restaurant}
					restaurantBagItems={userFavorites.filter(
						(restaurantBagItem) => restaurantBagItem.restaurantItem.restaurantUid === restaurant.uid
					)}
				/>
			</IonContent>
		</IonPage>
	)
}

export default RestaurantFavoritesPage
