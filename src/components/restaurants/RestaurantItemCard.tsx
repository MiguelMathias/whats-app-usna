import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonLabel, IonRouterLink } from '@ionic/react'
import { deleteDoc, doc } from 'firebase/firestore'
import { addOutline, createOutline, removeOutline } from 'ionicons/icons'
import { useContext } from 'react'
import { useParams } from 'react-router'
import { AppContext } from '../../AppContext'
import { RestaurantBagItemModel, restaurantBagItemPrice } from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'
import { encodeB64Url } from '../../util/misc'
import './RestaurantItemCard.scss'
import RestaurantItemFavoriteButton from './RestaurantItemFavoriteButton'
import RestaurantItemImgSlides from './RestaurantItemImgSlides'

type RestaurantItemCardProps = {
	restaurantBagItem: RestaurantBagItemModel
	userFavoriteItems: RestaurantBagItemModel[]
	isOrder?: boolean
}

const RestaurantItemCard: React.FC<RestaurantItemCardProps> = ({ restaurantBagItem, userFavoriteItems, isOrder }) => {
	const { restaurantPathParamB64 } = useParams<{ restaurantPathParamB64: string }>()
	const { user } = useContext(AppContext)
	const restaurantBagItemB64Url = encodeB64Url(restaurantBagItem)

	return (
		<IonCard className='restaurant-item-card'>
			<RestaurantItemImgSlides restaurantItem={restaurantBagItem.restaurantItem} maxImgHeight={250} />
			<IonCardHeader>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<IonRouterLink routerLink={`/restaurants/${restaurantPathParamB64}/menu/${restaurantBagItemB64Url}`}>
						<IonCardTitle class='ion-text-left'>{restaurantBagItem.restaurantItem.name}</IonCardTitle>
					</IonRouterLink>
					<IonButtons>
						<RestaurantItemFavoriteButton restaurantBagItem={restaurantBagItem} userFavoriteItems={userFavoriteItems} />
					</IonButtons>
				</div>
			</IonCardHeader>
			<IonCardContent>
				<IonLabel class='ion-text-wrap'>
					{restaurantBagItem.restaurantItem.ingredients
						.filter((ingredient) => ingredient.selected)
						.map((ingredient) => ingredient.name)
						.join(', ')}
				</IonLabel>
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
						<IonButton routerLink={`/restaurants/${restaurantPathParamB64}/menu/${restaurantBagItemB64Url}`}>
							<IonIcon slot='icon-only' icon={restaurantBagItem.uid && !isOrder ? createOutline : addOutline} />
						</IonButton>
					</IonButtons>
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default RestaurantItemCard
