import { IonContent, IonItem, IonLabel, IonList, IonPage } from '@ionic/react'
import { useParams } from 'react-router'
import RestaurantPageHeader from '../../components/restaurants/RestaurantPageHeader'
import { RestaurantModel, RestaurantOrderModel } from '../../data/restaurants/Restaurant'
import { encodeB64Url, formatDateDefault } from '../../util/misc'

type RestaurantOrdersPageProps = {
	restaurant: RestaurantModel
	orders: RestaurantOrderModel[]
	locationUid?: string
}

const RestaurantOrdersPage: React.FC<RestaurantOrdersPageProps> = ({ restaurant, orders, locationUid }) => {
	const { restaurantPathParamB64 } = useParams<{ restaurantPathParamB64: string }>()
	return (
		<IonPage>
			<RestaurantPageHeader headerText='Orders' restaurant={restaurant} locationUid={locationUid} />
			<IonContent fullscreen>
				<IonList>
					{orders.map((order, index) => (
						<IonItem
							key={index}
							detail
							routerLink={`/restaurants/${restaurantPathParamB64}/orders/${encodeB64Url(
								order.submitted
							)}`}
						>
							<IonLabel>{order.submitted ? formatDateDefault(order.submitted.toDate()) : ''}</IonLabel>
						</IonItem>
					))}
				</IonList>
			</IonContent>
		</IonPage>
	)
}

export default RestaurantOrdersPage
