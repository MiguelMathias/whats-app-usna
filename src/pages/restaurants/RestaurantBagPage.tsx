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
	useIonModal,
	useIonPicker,
	useIonToast,
} from '@ionic/react'
import { addHours, format, getDate, getHours, getMinutes, getMonth, getYear, parse, startOfToday } from 'date-fns'
import addMinutes from 'date-fns/addMinutes'
import { roundToNearestMinutes } from 'date-fns/esm'
import { collection, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { bagCheckOutline } from 'ionicons/icons'
import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../AppContext'
import RestaurantMenu from '../../components/restaurants/RestaurantMenu'
import {
	getRestaurantHours,
	orderReadyMinMinutes,
	orderTotalPrice,
	RestaurantBagItemModel,
	RestaurantModel,
	RestaurantOrderModel,
} from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'

type RestaurantBagPageProps = {
	restaurant: RestaurantModel
	userBagItems: RestaurantBagItemModel[]
	userFavoriteItems: RestaurantBagItemModel[]
	locationUid?: string
}

const RestaurantBagPage: React.FC<RestaurantBagPageProps> = ({ restaurant, userBagItems, userFavoriteItems, locationUid }) => {
	const { user, userData } = useContext(AppContext)
	const location = restaurant.locations.find((location) => location.uid === locationUid)

	const minPickupTime = () => roundToNearestMinutes(addMinutes(Date.now(), orderReadyMinMinutes(userBagItems)), { nearestTo: 15 })

	const getPickupTimes = (minPickup: Date = minPickupTime()) => {
		const pickupTimes = []
		for (
			let pickupTime = minPickup;
			pickupTime < (getRestaurantHours(restaurant, minPickup)?.end ?? addHours(startOfToday(), 16));
			pickupTime = addMinutes(pickupTime, 15)
		)
			pickupTimes.push(pickupTime)
		return pickupTimes
	}

	const [chosenDate, setChosenDate] = useState(minPickupTime())
	const [chosenTime, setChosenTime] = useState(minPickupTime())
	const [masterDateTime, setMasterDateTime] = useState<Date | 'ASAP'>('ASAP')

	const [showSubmittedToast, _] = useIonToast()

	const [presentTimePicker] = useIonPicker()

	const [presentPickupModal, dismissPickupModal] = useIonModal(
		<>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonButton
							onClick={() => {
								setMasterDateTime('ASAP')
								dismissPickupModal()
							}}
						>
							ASAP
						</IonButton>
					</IonButtons>
					<IonButtons slot='end'>
						<IonButton
							onClick={() => {
								setMasterDateTime(
									new Date(getYear(chosenDate), getMonth(chosenDate), getDate(chosenDate), getHours(chosenTime), getMinutes(chosenTime), 0, 0)
								)
								dismissPickupModal()
							}}
							disabled={
								new Date(getYear(chosenDate), getMonth(chosenDate), getDate(chosenDate), getHours(chosenTime), getMinutes(chosenTime), 0, 0) <
								minPickupTime()
							}
						>
							Confirm
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonDatetime
					style={{ minWidth: '100%' }}
					min={format(minPickupTime(), 'yyyy-MM-dd')}
					value={format(chosenDate, 'yyyy-MM-dd')}
					presentation='date'
					onIonChange={(e) => setChosenDate(parse(e.detail.value ?? format(new Date(), 'yyyy-MM-dd'), 'yyyy-MM-dd', new Date()))}
				/>
				<IonItem
					button
					detail
					onClick={() =>
						presentTimePicker({
							buttons: [
								{ text: 'Cancel' },
								{
									text: 'Confirm',
									handler: (selected) => setChosenTime(selected.time.value),
								},
							],
							columns: [
								{
									name: 'time',
									options: getPickupTimes(getDate(chosenDate) > getDate(minPickupTime()) ? chosenDate : minPickupTime()).map((time) => ({
										text: format(time, 'H:mm'),
										value: time,
									})),
									selectedIndex: getPickupTimes(getDate(chosenDate) > getDate(minPickupTime()) ? chosenDate : minPickupTime()).findIndex(
										(date) => format(date, 'H:mm') === format(chosenTime, 'H:mm')
									),
								},
							],
						})
					}
				>
					<IonLabel>Set Pickup Time</IonLabel>
					<IonLabel slot='end'>{format(chosenTime, 'H:mm')}</IonLabel>
				</IonItem>
			</IonContent>
		</>
	)
	const contentRef = useRef<HTMLIonContentElement | null>(null)

	useEffect(() => setChosenTime(new Date(chosenTime) < new Date(minPickupTime()) ? minPickupTime() : chosenTime), [userBagItems.join()])

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
										scheduledPickup: Timestamp.fromDate(new Date(chosenTime)),
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
										message: `Order will be ready at approximately ${format(new Date(chosenTime), 'H:mm')}`,
									})
								}
							}}
						>
							<IonIcon slot='icon-only' icon={bagCheckOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen ref={contentRef}>
				<IonItem button detail onClick={() => presentPickupModal({ swipeToClose: true, presentingElement: contentRef.current ?? undefined })}>
					<IonLabel>Scheduled Pickup</IonLabel>
					<IonLabel slot='end'>{masterDateTime !== 'ASAP' ? format(masterDateTime, 'EEE MMM dd, H:mm a') : 'ASAP'}</IonLabel>
				</IonItem>
				<RestaurantMenu restaurantBagItems={userBagItems ?? []} userFavoriteItems={userFavoriteItems} />
			</IonContent>
		</IonPage>
	)
}

export default RestaurantBagPage
