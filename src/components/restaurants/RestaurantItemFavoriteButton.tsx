import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { star, starOutline } from 'ionicons/icons'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import { RestaurantItemModel } from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'

type RestaurantItemFavoriteButtonProps = {
	restaurantItem: RestaurantItemModel
	slot?: string
}

const RestaurantItemFavoriteButton: React.FC<RestaurantItemFavoriteButtonProps> = ({ restaurantItem, slot }) => {
	const { user, userFavorites } = useContext(AppContext)
	return (
		<IonButtons slot={slot}>
			<IonButton
				shape='round'
				fill='solid'
				color='transparent'
				onClick={() => {
					if (user) {
						if (userFavorites.map((favItem) => favItem.uid).includes(restaurantItem.uid))
							deleteDoc(doc(firestore, 'users', user.uid, 'favorites', restaurantItem.uid))
						else setDoc(doc(firestore, 'users', user.uid, 'favorites', restaurantItem.uid), restaurantItem)
					}
				}}
			>
				<IonIcon
					color='dark'
					slot='icon-only'
					icon={
						userFavorites?.map((favRestItem) => favRestItem.uid).includes(restaurantItem.uid)
							? star
							: starOutline
					}
				/>
			</IonButton>
		</IonButtons>
	)
}

export default RestaurantItemFavoriteButton
