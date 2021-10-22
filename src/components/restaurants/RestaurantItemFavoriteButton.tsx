import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { star, starOutline } from 'ionicons/icons'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import { RestaurantBagItemModel } from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'
import { object_equals } from '../../util/misc'

type RestaurantItemFavoriteButtonProps = {
	restaurantBagItem: RestaurantBagItemModel
	userFavoriteItems: RestaurantBagItemModel[]
	slot?: string
	compByDetail?: boolean
}

const RestaurantItemFavoriteButton: React.FC<RestaurantItemFavoriteButtonProps> = ({ restaurantBagItem, userFavoriteItems, slot, compByDetail }) => {
	const { user } = useContext(AppContext)

	const isFavorite = () =>
		compByDetail
			? userFavoriteItems.filter((favoriteItem) => object_equals({ ...favoriteItem, uid: '' }, { ...restaurantBagItem, uid: '' })).length > 0
			: userFavoriteItems.map((favItem) => favItem.restaurantItem.uid).includes(restaurantBagItem.restaurantItem.uid)

	return (
		<IonButtons slot={slot}>
			<IonButton
				shape='round'
				fill='solid'
				color='transparent'
				onClick={() => {
					if (user) {
						if (isFavorite()) deleteDoc(doc(firestore, 'users', user.uid, 'favorites', restaurantBagItem.restaurantItem.uid))
						else setDoc(doc(firestore, 'users', user.uid, 'favorites', restaurantBagItem.restaurantItem.uid), restaurantBagItem)
					}
				}}
			>
				<IonIcon color='dark' slot='icon-only' icon={isFavorite() ? star : starOutline} />
			</IonButton>
		</IonButtons>
	)
}

export default RestaurantItemFavoriteButton
