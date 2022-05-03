import { IonBadge, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { collection, CollectionReference, DocumentData, onSnapshot, orderBy, query, QueryConstraint, where } from 'firebase/firestore'
import { bag, calendar, receipt, star } from 'ionicons/icons'
import { useContext, useEffect, useState } from 'react'
import { Redirect, Route, useParams } from 'react-router'
import { AppContext } from '../../AppContext'
import { RestaurantBagItemModel, RestaurantModel, RestaurantOrderModel, RestaurantPathParameterModel } from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'
import { decodeB64Url } from '../../util/misc'
import LoadingPage from '../LoadingPage'
import LoginPromptPage from '../LoginPromptPage'
import RestaurantBagPage from './RestaurantBagPage'
import RestaurantClosedPage from './RestaurantClosedPage'
import RestaurantFavoritesPage from './RestaurantFavoritesPage'
import RestaurantItemPage from './RestaurantItemPage'
import RestaurantMainMenuPage from './RestaurantMainMenuPage'
import RestaurantOrderPage from './RestaurantOrderPage'
import RestaurantOrdersPage from './RestaurantOrdersPage'
import './RestaurantTabs.scss'

type RestaurantTabsProps = {
	restaurants: RestaurantModel[]
}

const RestaurantTabs: React.FC<RestaurantTabsProps> = ({ restaurants }) => {
	const { restaurantPathParamB64 } = useParams<{ restaurantPathParamB64: string }>()
	const { restaurantUid, locationUid } = decodeB64Url<RestaurantPathParameterModel>(restaurantPathParamB64)
	const restaurant = restaurants.find((restaurant) => restaurant.uid === restaurantUid)

	const { user } = useContext(AppContext)
	const [restaurantBagItems, setRestaurantBagItems] = useState<RestaurantBagItemModel[]>([])
	const [userFavoriteItems, setUserFavoriteItems] = useState<RestaurantBagItemModel[]>([])
	const [userBagItems, setUserBagItems] = useState<RestaurantBagItemModel[]>([])
	const [userOrders, setUserOrders] = useState<RestaurantOrderModel[]>([])

	useEffect(() => {
		if (restaurant) {
			const itemsQuery = (collection: CollectionReference<DocumentData>, ...extraConstraints: QueryConstraint[]) =>
				locationUid
					? query(
							collection,
							where('restaurantItem.restaurantUid', '==', restaurant.uid),
							where('restaurantItem.locationUids', 'array-contains', locationUid),
							...extraConstraints
					  )
					: query(collection, where('restaurantItem.restaurantUid', '==', restaurant.uid), ...extraConstraints)

			const bagItemsQuery = (collection: CollectionReference<DocumentData>, ...extraConstraints: QueryConstraint[]) =>
				locationUid
					? query(
							collection,
							where('restaurantItem.restaurantUid', '==', restaurant.uid),
							where('restaurantItem.locationUids', 'array-contains', locationUid),
							...extraConstraints
					  )
					: query(collection, where('restaurantItem.restaurantUid', '==', restaurant.uid), ...extraConstraints)

			const unSubItems = onSnapshot(itemsQuery(collection(firestore, 'restaurants', restaurant.uid, 'items')), (snapshot) =>
				setRestaurantBagItems(snapshot.docs.map((doc) => doc.data() as RestaurantBagItemModel))
			)

			let unSubFavorites = () => {}
			let unSubBag = () => {}
			let unSubOrders = () => {}
			if (user) {
				unSubFavorites = onSnapshot(bagItemsQuery(collection(firestore, 'users', user.uid, 'favorites')), (snapshot) =>
					setUserFavoriteItems(snapshot.docs.map((doc) => doc.data() as RestaurantBagItemModel))
				)
				unSubBag = onSnapshot(bagItemsQuery(collection(firestore, 'users', user.uid, 'bag')), (snapshot) =>
					setUserBagItems(snapshot.docs.map((doc) => doc.data() as RestaurantBagItemModel))
				)
				unSubOrders = onSnapshot(
					locationUid
						? query(
								collection(firestore, 'users', user.uid, 'orders'),
								orderBy('submitted', 'desc'),
								where('restaurantLocationUid', '==', locationUid)
						  )
						: query(collection(firestore, 'users', user.uid, 'orders'), orderBy('submitted', 'desc'), where('restaurantUid', '==', restaurant.uid)),
					(snapshot) => setUserOrders(snapshot.docs.map((doc) => doc.data() as RestaurantOrderModel))
				)
			}
			return () => {
				unSubItems()
				unSubFavorites()
				unSubBag()
				unSubOrders()
			}
		}
	}, [user?.uid, restaurantUid, locationUid])

	if (!restaurant) return <LoadingPage />

	if (!user) return <LoginPromptPage />

	if (restaurant.manuallyClosed) return <RestaurantClosedPage restaurant={restaurant} />

	return (
		<IonTabs>
			<IonRouterOutlet>
				<Route exact path={`/restaurants/:restaurantPathParamB64`}>
					<Redirect exact to={`/restaurants/${restaurantPathParamB64}/menu`} />
				</Route>
				<Route exact path={`/restaurants/:restaurantPathParamB64/menu/:restaurantBagItemB64`}>
					<RestaurantItemPage userFavoriteItems={userFavoriteItems} />
				</Route>
				<Route exact path={`/restaurants/:restaurantPathParamB64/menu`}>
					<RestaurantMainMenuPage
						restaurant={restaurant}
						restaurantBagItems={restaurantBagItems}
						userFavoriteItems={userFavoriteItems}
						locationUid={locationUid}
					/>
				</Route>
				<Route exact path={`/restaurants/:restaurantPathParamB64/favorites`}>
					<RestaurantFavoritesPage restaurant={restaurant} userFavoriteItems={userFavoriteItems} locationUid={locationUid} />
				</Route>
				<Route exact path={`/restaurants/:restaurantPathParamB64/bag`}>
					<RestaurantBagPage restaurant={restaurant} userBagItems={userBagItems} userFavoriteItems={userFavoriteItems} locationUid={locationUid} />
				</Route>
				<Route exact path={`/restaurants/:restaurantPathParamB64/orders/:restaurantOrderTSB64`}>
					<RestaurantOrderPage userOrders={userOrders} userFavoriteItems={userFavoriteItems} />
				</Route>
				<Route exact path={`/restaurants/:restaurantPathParamB64/orders`}>
					<RestaurantOrdersPage restaurant={restaurant} orders={userOrders} locationUid={locationUid} />
				</Route>
			</IonRouterOutlet>
			<IonTabBar slot='bottom'>
				<IonTabButton tab='menu' href={`/restaurants/${restaurantPathParamB64}/menu`}>
					<IonIcon icon={calendar} />
					<IonLabel>Menu</IonLabel>
				</IonTabButton>
				<IonTabButton tab='favorites' href={`/restaurants/${restaurantPathParamB64}/favorites`}>
					<IonIcon icon={star} />
					<IonLabel>Favorites</IonLabel>
				</IonTabButton>
				<IonTabButton tab='bag' href={`/restaurants/${restaurantPathParamB64}/bag`}>
					{userBagItems.length ? (
						<>
							<IonBadge className='icon-badge'>{userBagItems.length}</IonBadge>
							<IonIcon className='icon-badge-icon' icon={bag} />
						</>
					) : (
						<IonIcon icon={bag} />
					)}
					<IonLabel>Bag</IonLabel>
				</IonTabButton>
				<IonTabButton tab='orders' href={`/restaurants/${restaurantPathParamB64}/orders`}>
					<IonIcon icon={receipt} />
					<IonLabel>Orders</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs>
	)
}

export default RestaurantTabs
