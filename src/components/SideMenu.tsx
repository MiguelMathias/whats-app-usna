import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle } from '@ionic/react'
import { cashOutline, helpOutline, libraryOutline, personOutline, restaurantOutline } from 'ionicons/icons'
import { useContext } from 'react'
import { useLocation } from 'react-router'
import { AppContext } from '../AppContext'
import { RestaurantModel } from '../data/restaurants/Restaurant'
import { capitalize } from '../util/misc'
import './SideMenu.scss'

type Pages = {
	title: string
	path: string
	icon?: string
	routerDirection?: string
}

type SideMenuProps = {
	restaurants: RestaurantModel[]
}

const SideMenu: React.FC<SideMenuProps> = ({ restaurants }) => {
	const location = useLocation()
	const { user } = useContext(AppContext)

	const routes = {
		appPages: [
			{ title: 'MFSD', path: '/mfsd', icon: restaurantOutline },
			{ title: 'MWF', path: '/mwf', icon: cashOutline },
			{ title: 'NABSD', path: '/nabsd', icon: libraryOutline },
		] as Pages[],
		restaurantPages: restaurants.map(
			(restaurant) =>
				({
					title: capitalize(restaurant.name),
					path: `/restaurants/${restaurant.uid}`,
				} as Pages)
		),
		accountPages: [
			{
				title: user ? 'Account' : 'Log In',
				path: '/account',
				icon: personOutline,
			},
			{ title: 'Feedback', path: '/feedback', icon: helpOutline },
		] as Pages[],
	}

	const renderListItems = (pages: Pages[]) => {
		return pages
			.filter((route) => !!route.path)
			.map((page, i) => (
				<IonMenuToggle key={i} auto-hide='false'>
					<IonItem routerLink={page.path} routerDirection='root' className={location.pathname.startsWith(page.path) ? 'selected' : undefined}>
						<IonIcon slot='start' icon={page.icon} />
						<IonLabel>{page.title}</IonLabel>
					</IonItem>
				</IonMenuToggle>
			))
	}
	return (
		<IonMenu swipeGesture type='push' contentId='main'>
			<IonContent forceOverscroll={false}>
				<IonList lines='none'>
					<IonListHeader>USNA</IonListHeader>
					{renderListItems(routes.appPages)}
				</IonList>
				{!!routes.restaurantPages.length && (
					<IonList lines='none'>
						<IonListHeader>Restaurants</IonListHeader>
						{renderListItems(routes.restaurantPages)}
					</IonList>
				)}
				<IonList lines='none'>
					<IonListHeader>Account</IonListHeader>
					{renderListItems(routes.accountPages)}
				</IonList>
			</IonContent>
		</IonMenu>
	)
}

export default SideMenu
