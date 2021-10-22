import { setDoc, Timestamp } from '@firebase/firestore'
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonToast,
} from '@ionic/react'
import { doc } from 'firebase/firestore'
import { bagAddOutline } from 'ionicons/icons'
import { useContext } from 'react'
import { useParams } from 'react-router'
import { AppContext } from '../../AppContext'
import RestaurantMenu from '../../components/restaurants/RestaurantMenu'
import { orderTotalPrice, RestaurantBagItemModel, RestaurantOrderModel } from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'
import { decodeB64Url, formatDateDefault } from '../../util/misc'
import LoadingPage from '../LoadingPage'

type RestaurantOrderPageProps = {
	userFavoriteItems: RestaurantBagItemModel[]
	userOrders: RestaurantOrderModel[]
}

const RestaurantOrderPage: React.FC<RestaurantOrderPageProps> = ({ userFavoriteItems, userOrders }) => {
	const { restaurantPathParamB64 } = useParams<{ restaurantPathParamB64: string }>()
	const { user } = useContext(AppContext)
	const { restaurantOrderTSB64 } = useParams<{ restaurantOrderTSB64: string }>()
	const restaurantOrderTS = decodeB64Url<Timestamp>(restaurantOrderTSB64)
	const restaurantOrder = userOrders.find((order) => order.submitted?.isEqual(restaurantOrderTS))
	const [showAddSuccessToast, _] = useIonToast()

	if (!restaurantOrder) return <LoadingPage />

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref={`/restaurants/${restaurantPathParamB64}/orders`} />
					</IonButtons>
					<IonTitle>{restaurantOrder.submitted ? formatDateDefault(restaurantOrder.submitted?.toDate()) : 'Date of order unknown'}</IonTitle>
					<IonButtons slot='end'>
						<IonButton
							onClick={() => {
								if (user) {
									restaurantOrder.restaurantBagItems.forEach((restaurantBagItem) =>
										setDoc(doc(firestore, 'users', user.uid, 'bag', restaurantBagItem.uid), restaurantBagItem)
									)
									showAddSuccessToast({
										header: 'Added Items',
										message: 'Added all items from this order to your current shopping bag!',
										color: 'success',
										duration: 2000,
									})
								}
							}}
						>
							<IonIcon slot='icon-only' icon={bagAddOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					<IonItem>
						<IonLabel>Order Total:</IonLabel>
						<IonLabel slot='end'>${orderTotalPrice(restaurantOrder)}</IonLabel>
					</IonItem>
					{restaurantOrder.submitted && (
						<IonItem>
							<IonLabel>Submitted</IonLabel>
							<IonLabel slot='end'>{formatDateDefault(restaurantOrder.submitted.toDate())}</IonLabel>
						</IonItem>
					)}
					{restaurantOrder.accepted && (
						<IonItem>
							<IonLabel>Accepted</IonLabel>
							<IonLabel slot='end'>{formatDateDefault(restaurantOrder.accepted.toDate())}</IonLabel>
						</IonItem>
					)}
					{restaurantOrder.rejected && (
						<IonItem>
							<IonLabel>Rejected</IonLabel>
							<IonLabel slot='end'>{formatDateDefault(restaurantOrder.rejected.toDate())}</IonLabel>
						</IonItem>
					)}
					{restaurantOrder.fulfilled && (
						<IonItem>
							<IonLabel>Fulfilled</IonLabel>
							<IonLabel slot='end'>{formatDateDefault(restaurantOrder.fulfilled.toDate())}</IonLabel>
						</IonItem>
					)}
					{restaurantOrder.scheduledPickup && (
						<IonItem>
							<IonLabel>Scheduled Pickup</IonLabel>
							<IonLabel slot='end'>{formatDateDefault(restaurantOrder.scheduledPickup.toDate())}</IonLabel>
						</IonItem>
					)}
				</IonList>
				<RestaurantMenu restaurantBagItems={restaurantOrder.restaurantBagItems ?? []} userFavoriteItems={userFavoriteItems} isOrder />
			</IonContent>
		</IonPage>
	)
}

export default RestaurantOrderPage
