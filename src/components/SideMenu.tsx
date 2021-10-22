import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle } from '@ionic/react'
import { cashOutline, helpOutline, libraryOutline, personOutline, restaurantOutline } from 'ionicons/icons'
import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { AppContext } from '../AppContext'
import { RestaurantModel, RestaurantPathParameterModel } from '../data/restaurants/Restaurant'
import { capitalize, encodeB64Url } from '../util/misc'
import AccordionIonItem from './AccordionIonItem'
import './SideMenu.scss'

type Pages = {
	title: string
	path: string
	icon?: string
	routerDirection?: string
	subPages?: Pages[]
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
					path: `/restaurants/${encodeB64Url({
						restaurantUid: restaurant.uid,
					} as RestaurantPathParameterModel)}`,
					subPages:
						restaurant.locations.length > 0
							? restaurant.locations.map(
									(location) =>
										({
											title: capitalize(location.name),
											path: `/restaurants/${encodeB64Url({
												restaurantUid: restaurant.uid,
												locationUid: location.uid,
											} as RestaurantPathParameterModel)}`,
										} as Pages)
							  )
							: undefined,
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
				<IonMenuToggle key={i} autoHide={false}>
					{page.subPages ? (
						<IonMenuToggle autoHide={false}>
							<IonIcon slot='start' icon={page.icon} />
							<AccordionIonItem
								initiallyOpen
								className={page.subPages.find((subPage) => location.pathname.startsWith(subPage.path)) ? 'selected' : undefined}
								header={page.title}
								label
							>
								{page.subPages.map((subPage, j) => (
									<React.Fragment key={j}>
										<IonItem
											routerLink={subPage.path}
											routerDirection='root'
											className={location.pathname.startsWith(subPage.path) ? 'selected' : undefined}
										>
											<IonIcon slot='start' icon={subPage.icon} />
											<IonLabel>{subPage.title}</IonLabel>
										</IonItem>
									</React.Fragment>
								))}
							</AccordionIonItem>
						</IonMenuToggle>
					) : (
						<>
							<IonIcon slot='start' icon={page.icon} />
							<IonItem routerLink={page.path} routerDirection='root' className={location.pathname.startsWith(page.path) ? 'selected' : undefined}>
								{page.icon && <IonIcon slot='start' icon={page.icon} />}
								<IonLabel>{page.title}</IonLabel>
							</IonItem>
						</>
					)}
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
