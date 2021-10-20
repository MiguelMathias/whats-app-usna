import { IonContent, IonItem, IonLabel, IonList, IonPage } from '@ionic/react'
import RestaurantPageHeader from '../../components/restaurants/RestaurantPageHeader'
import { RestaurantModel, RestaurantOrderModel } from '../../data/restaurants/Restaurant'
import { encodeB64Url, formatDateDefault } from '../../util/misc'

type RestaurantOrdersPageProps = {
	restaurant: RestaurantModel
	orders: RestaurantOrderModel[]
}

const RestaurantOrdersPage: React.FC<RestaurantOrdersPageProps> = ({ restaurant, orders }) => (
	<IonPage>
		<RestaurantPageHeader headerText='Orders' restaurant={restaurant} />
		<IonContent>
			<IonList>
				{orders.map((order, index) => (
					<IonItem
						key={index}
						detail
						routerLink={`/restaurants/${restaurant.uid}/orders/${encodeB64Url(order.submitted)}`}
					>
						<IonLabel>{order.submitted ? formatDateDefault(order.submitted.toDate()) : ''}</IonLabel>
					</IonItem>
				))}
			</IonList>
		</IonContent>
	</IonPage>
)

export default RestaurantOrdersPage
