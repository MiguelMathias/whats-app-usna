import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonLabel, IonRouterLink } from '@ionic/react'
import { deleteDoc, doc } from 'firebase/firestore'
import { addOutline, createOutline, removeOutline } from 'ionicons/icons'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import { RestaurantBagItemModel, restaurantBagItemPrice, RestaurantModel } from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'
import { encodeB64Url } from '../../util/misc'
import './RestaurantItemCard.scss'
import RestaurantItemFavoriteButton from './RestaurantItemFavoriteButton'

type RestaurantItemCardProps = {
	restaurant: RestaurantModel
	restaurantBagItem: RestaurantBagItemModel
	isOrder?: boolean
}

const RestaurantItemCard: React.FC<RestaurantItemCardProps> = ({ restaurant, restaurantBagItem, isOrder }) => {
	const { user } = useContext(AppContext)
	const restaurantBagItemB64Url = encodeB64Url(restaurantBagItem)

	return (
		<IonCard className='restaurant-item-card'>
			<IonCardHeader>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<IonRouterLink routerLink={`/restaurants/${restaurant.uid}/menu/${restaurantBagItemB64Url}`}>
						<IonCardTitle class='ion-text-left'>{restaurantBagItem.restaurantItem.name}</IonCardTitle>
					</IonRouterLink>
					<IonButtons>
						<RestaurantItemFavoriteButton restaurantBagItem={restaurantBagItem} />
					</IonButtons>
				</div>
			</IonCardHeader>
			<IonCardContent>
				{/* add image slides */}
				<IonLabel class='ion-text-wrap'>{restaurantBagItem.restaurantItem.ingredients.map((ingredient) => ingredient.name).join(', ')}</IonLabel>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}
				>
					{restaurantBagItem.uid && !isOrder && (
						<IonButtons slot='end'>
							<IonButton
								onClick={async () => {
									if (user) await deleteDoc(doc(firestore, 'users', user.uid, 'bag', restaurantBagItem.uid))
								}}
							>
								<IonIcon slot='icon-only' icon={removeOutline} />
							</IonButton>
						</IonButtons>
					)}
					<IonLabel color='dark'>${restaurantBagItemPrice(restaurantBagItem)}</IonLabel>
					<IonButtons slot='end'>
						<IonButton routerLink={`/restaurants/${restaurant.uid}/menu/${restaurantBagItemB64Url}`}>
							<IonIcon slot='icon-only' icon={restaurantBagItem.uid && !isOrder ? createOutline : addOutline} />
						</IonButton>
					</IonButtons>
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default RestaurantItemCard
