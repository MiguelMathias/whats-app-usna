import {
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
	useIonModal,
} from '@ionic/react'
import { closeOutline, informationCircleOutline } from 'ionicons/icons'
import { RestaurantModel } from '../../data/restaurants/Restaurant'
import { daysOfWeek } from '../../util/misc'
import AccordionIonItem from '../AccordionIonItem'

type RestaurantInfoButtonProps = {
	restaurant: RestaurantModel
	slot?: string
}

const RestaurantInfoButton: React.FC<RestaurantInfoButtonProps> = ({ restaurant, slot }) => {
	const [showInfoModal, hideInfoModal] = useIonModal(
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>{restaurant.name} Info</IonTitle>
					<IonButtons slot={slot}>
						<IonButton onClick={() => hideInfoModal()}>
							<IonIcon slot='icon-only' icon={closeOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<AccordionIonItem header='Hours'>
					<IonList>
						{Object.entries(restaurant.hours)
							.sort(([dayA], [dayB]) => daysOfWeek.indexOf(dayA) - daysOfWeek.indexOf(dayB))
							.filter(([_, { open }]) => !!open)
							.map(([day, { open, close }], i) => (
								<IonItem key={i}>
									<IonLabel slot='start'>{day}</IonLabel>
									<div>
										<p>Open: {open}</p>
										<p>Close: {close}</p>
									</div>
								</IonItem>
							))}
					</IonList>
				</AccordionIonItem>
				<AccordionIonItem header='Description' initiallyOpen>
					<div
						style={{ whiteSpace: 'pre-wrap', padding: 10 }}
						dangerouslySetInnerHTML={{
							__html: restaurant.description?.replaceAll('<a', '<a target="_blank"') ?? '',
						}}
					/>
				</AccordionIonItem>
			</IonContent>
		</IonPage>
	)

	return (
		<>
			<IonButtons slot='end'>
				<IonButton onClick={() => showInfoModal({ swipeToClose: true })}>
					<IonIcon slot='icon-only' icon={informationCircleOutline} />
				</IonButton>
			</IonButtons>
		</>
	)
}

export default RestaurantInfoButton
