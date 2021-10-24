import { doc, query, setDoc, Timestamp, where } from '@firebase/firestore'
import {
	IonButton,
	IonButtons,
	IonContent,
	IonDatetime,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonToast,
} from '@ionic/react'
import { format } from 'date-fns'
import addMinutes from 'date-fns/addMinutes'
import { roundToNearestMinutes } from 'date-fns/esm'
import { collection, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { bagCheckOutline } from 'ionicons/icons'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import RestaurantMenu from '../../components/restaurants/RestaurantMenu'
import {
	getMaxRestaurantHours,
	getRestaurantHours,
	orderReadyMinMinutes,
	orderTotalPrice,
	RestaurantBagItemModel,
	RestaurantModel,
	RestaurantOrderModel,
} from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'
import { useForceUpdate } from '../../util/hooks'

type RestaurantBagPageProps = {
	restaurant: RestaurantModel
	userBagItems: RestaurantBagItemModel[]
	userFavoriteItems: RestaurantBagItemModel[]
	locationUid?: string
}

const RestaurantBagPage: React.FC<RestaurantBagPageProps> = ({ restaurant, userBagItems, userFavoriteItems, locationUid }) => {
	const { user, userData } = useContext(AppContext)
	const location = restaurant.locations.find((location) => location.uid === locationUid)

	const minPickupTime = () =>
		format(roundToNearestMinutes(addMinutes(Date.now(), orderReadyMinMinutes(userBagItems)), { nearestTo: 15 }), "yyyy-MM-dd'T'HH:mm:ss")

	const [chosenPickupTime, setChosenPickupTime] = useState(minPickupTime())

	const [showSubmittedToast, _] = useIonToast()

	const forceUpdate = useForceUpdate()

	useEffect(() => setChosenPickupTime(new Date(chosenPickupTime) < new Date(minPickupTime()) ? minPickupTime() : chosenPickupTime), [userBagItems.join()])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>
						{restaurant.name + (location?.name ? ` ${location.name}` : '')} Bag: ${orderTotalPrice(userBagItems)}
					</IonTitle>
					<IonButtons slot='end'>
						<IonButton
							disabled={!userBagItems.length}
							onClick={async () => {
								if (userData && user) {
									const newDoc = doc(collection(firestore, 'users', user.uid, 'orders'))
									const restaurantOrder = {
										displayName: user.displayName,
										userUid: user.uid,
										restaurantUid: restaurant.uid,
										restaurantBagItems: userBagItems,
										submitted: serverTimestamp(),
										scheduledPickup: Timestamp.fromDate(new Date(chosenPickupTime)),
										uid: newDoc.id,
									} as RestaurantOrderModel
									if (location?.uid) restaurantOrder.restaurantLocationUid = location?.uid
									await setDoc(newDoc, restaurantOrder)
									if (user)
										(
											await getDocs(
												query(
													collection(firestore, 'users', user.uid, 'bag'),
													where('restaurantItem.restaurantUid', '==', restaurant.uid)
												)
											)
										).docs
											.map((doc) => doc.ref)
											.forEach(deleteDoc)
									showSubmittedToast({
										header: 'Order submitted',
										color: 'success',
										duration: 2000,
										message: `Order will be ready at approximately ${format(new Date(chosenPickupTime), 'H:mm')}`,
									})
								}
							}}
						>
							<IonIcon slot='icon-only' icon={bagCheckOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonItem>
					<IonLabel>Pickup Time</IonLabel>
					<IonDatetime
						disabled={!userBagItems.length}
						displayFormat='H:mm D MMM'
						min={minPickupTime()}
						value={chosenPickupTime}
						display-timezone='America/New_York'
						minuteValues='0,15,30,45'
						hourValues={(() => {
							const { start, end } = getMaxRestaurantHours(restaurant)
							return Array.from({ length: end - start + 1 }, (_, i) => i + start)
						})()}
						onIonChange={(e) => {
							const newPickupTime = new Date(e.detail.value!)
							const minOfDay = getRestaurantHours(restaurant, newPickupTime)?.start as Date
							const maxOfDay = getRestaurantHours(restaurant, newPickupTime)?.end as Date

							setChosenPickupTime(
								newPickupTime > maxOfDay
									? format(maxOfDay, "yyyy-MM-dd'T'HH:mm:ss-04:00")
									: newPickupTime < minOfDay || !e.detail.value
									? format(minOfDay, "yyyy-MM-dd'T'HH:mm:ss-04:00")
									: e.detail.value
							)
							forceUpdate()
						}}
					/>
				</IonItem>
				<RestaurantMenu restaurantBagItems={userBagItems ?? []} userFavoriteItems={userFavoriteItems} />
			</IonContent>
		</IonPage>
	)
}

export default RestaurantBagPage
