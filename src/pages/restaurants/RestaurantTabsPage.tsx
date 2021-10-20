import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { bag, calendar, receipt, star } from 'ionicons/icons'
import { useContext, useEffect, useState } from 'react'
import { Redirect, Route, useParams } from 'react-router'
import { AppContext } from '../../AppContext'
import { RestaurantItemModel, RestaurantModel, RestaurantOrderModel } from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'
import LoadingPage from '../LoadingPage'
import LoginPromptPage from '../LoginPromptPage'
import RestaurantBagPage from './RestaurantBagPage'
import RestaurantClosedPage from './RestaurantClosedPage'
import RestaurantFavoritesPage from './RestaurantFavoritesPage'
import RestaurantItemDetailPage from './RestaurantItemDetailPage'
import RestaurantMainMenuPage from './RestaurantMainMenuPage'
import RestaurantOrderPage from './RestaurantOrderPage'
import RestaurantOrdersPage from './RestaurantOrdersPage'

type RestaurantTabsPageProps = {
	restaurants: RestaurantModel[]
}

const RestaurantTabsPage: React.FC<RestaurantTabsPageProps> = ({ restaurants }) => {
	const { restaurantUid } = useParams<{ restaurantUid: string }>()
	const restaurant = restaurants.find((restaurant) => restaurant.uid === restaurantUid)

	const { user } = useContext(AppContext)
	const [restaurantItems, setRestaurantItems] = useState<RestaurantItemModel[]>([])
	const [orders, setOrders] = useState<RestaurantOrderModel[]>([])

	useEffect(() => {
		if (restaurant) {
			const unSubItems = onSnapshot(
				query(collection(firestore, 'restaurants', restaurant.uid, 'items'), where('restaurantUid', '==', restaurant.uid)),
				(snapshot) => setRestaurantItems(snapshot.docs.map((doc) => doc.data() as RestaurantItemModel))
			)
			let unSubOrders = () => {}
			if (user)
				unSubOrders = onSnapshot(query(collection(firestore, 'users', user.uid, 'orders'), where('restaurantUid', '==', restaurant.uid)), (snapshot) =>
					setOrders(snapshot.docs.map((doc) => doc.data() as RestaurantOrderModel))
				)
			return () => {
				unSubItems()
				unSubOrders()
			}
		}
	}, [restaurant?.uid])

	if (!restaurant) return <LoadingPage />

	if (!user) return <LoginPromptPage />

	if (restaurant.manuallyClosed) return <RestaurantClosedPage restaurant={restaurant} />

	return (
		<IonTabs>
			<IonRouterOutlet>
				<Route exact path={`/restaurants/:restaurantUid`}>
					<Redirect exact to={`/restaurants/${restaurant.uid}/menu`} />
				</Route>
				<Route exact path={`/restaurants/:restaurantUid/menu/:restaurantBagItemB64`}>
					<RestaurantItemDetailPage restaurant={restaurant} restaurantItems={restaurantItems} />
				</Route>
				<Route exact path={`/restaurants/:restaurantUid/menu`}>
					<RestaurantMainMenuPage restaurant={restaurant} restaurantItems={restaurantItems} />
				</Route>
				<Route exact path={`/restaurants/:restaurantUid/favorites`}>
					<RestaurantFavoritesPage restaurant={restaurant} />
				</Route>
				<Route exact path={`/restaurants/:restaurantUid/bag`}>
					<RestaurantBagPage restaurant={restaurant} />
				</Route>
				<Route exact path={`/restaurants/:restaurantUid/orders/:restaurantOrderTSB64`}>
					<RestaurantOrderPage restaurant={restaurant} orders={orders} />
				</Route>
				<Route exact path={`/restaurants/:restaurantUid/orders`}>
					<RestaurantOrdersPage restaurant={restaurant} orders={orders} />
				</Route>
			</IonRouterOutlet>
			<IonTabBar slot='bottom'>
				<IonTabButton tab='menu' href={`/restaurants/${restaurant.uid}/menu`}>
					<IonIcon icon={calendar}></IonIcon>
					<IonLabel>Menu</IonLabel>
				</IonTabButton>
				<IonTabButton tab='favorites' href={`/restaurants/${restaurant.uid}/favorites`}>
					<IonIcon icon={star}></IonIcon>
					<IonLabel>Favorites</IonLabel>
				</IonTabButton>
				<IonTabButton tab='bag' href={`/restaurants/${restaurant.uid}/bag`}>
					<IonIcon icon={bag}></IonIcon>
					<IonLabel>Bag</IonLabel>
				</IonTabButton>
				<IonTabButton tab='orders' href={`/restaurants/${restaurant.uid}/orders`}>
					<IonIcon icon={receipt}></IonIcon>
					<IonLabel>Orders</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs>
	)
}

export default RestaurantTabsPage
