import { onSnapshot, setDoc, where } from '@firebase/firestore'
import { IonApp, IonRouterOutlet, IonSplitPane, useIonToast } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
import '@ionic/react/css/display.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/float-elements.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/typography.css'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { collection, doc, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { AppContext, AppContextType } from './AppContext'
import SideMenu from './components/SideMenu'
import { UserDataModel } from './data/account/User'
import { RestaurantModel } from './data/restaurants/Restaurant'
import { auth, firestore } from './Firebase'
import Account from './pages/account/Account'
import Home from './pages/Home'
import RestaurantTabsPage from './pages/restaurants/RestaurantTabsPage'
/* Theme variables */
import './theme/variables.css'

const App: React.FC = () => {
	const [user, setUser] = useState<User | undefined>(undefined)
	const [userData, setUserData] = useState<UserDataModel | undefined>(undefined)
	const [restaurants, setRestaurants] = useState<RestaurantModel[]>([])
	const [showBadAccountToast, _] = useIonToast()

	const appContextProviderValue = {
		user,
		setUser,
		userData,
		setUserData,
	} as AppContextType

	useEffect(() => {
		if (user) {
			const userDataUnsub = onSnapshot(doc(firestore, 'users', user.uid), (snapshot) => {
				console.log()
				if (snapshot.exists()) {
					const newUserData = snapshot.data() as UserDataModel
					if (!newUserData.uid) newUserData.uid = user.uid
					if (!newUserData.displayName) newUserData.displayName = user.displayName || undefined
					setUserData(newUserData)
				} else
					setDoc(doc(firestore, 'users', user.uid), {
						uid: user.uid,
						displayName: user.displayName,
					} as UserDataModel)
			})

			return () => {
				userDataUnsub()
			}
		} else {
			setUserData(undefined)
		}
	}, [user?.uid])

	onAuthStateChanged(auth, (user) => {
		if (/[a-zA-Z0-9]*@usna\.edu/.test(user?.email ?? '') /* /m[1-9]{6}@usna\.edu/.test(user?.email ?? '') */) setUser(user ?? undefined)
		else if (user) {
			showBadAccountToast({
				header: 'Wrong Account!',
				message: 'Must sign in with USNA (@usna.edu) Google account',
				color: 'warning',
				duration: 2000,
			})
			signOut(auth)
		} else setUser(undefined)
	})

	useEffectOnce(() => {
		onSnapshot(query(collection(firestore, 'restaurants'), where('active', '==', true)), (snapshot) =>
			setRestaurants(snapshot.docs.map((doc) => doc.data() as RestaurantModel))
		)
	})

	return (
		<AppContext.Provider value={appContextProviderValue}>
			<IonApp>
				<IonReactRouter>
					<IonSplitPane contentId='main'>
						<SideMenu restaurants={restaurants} />
						<IonRouterOutlet id='main'>
							<Route path={`/restaurants/:restaurantPathParamB64`}>
								<RestaurantTabsPage restaurants={restaurants} />
							</Route>
							<Route exact path='/mfsd'>
								<Home />
							</Route>
							<Route exact path='/mwf'>
								<Home />
							</Route>
							<Route exact path='/nabsd'>
								<Home />
							</Route>
							<Route exact path='/home'>
								<Home />
							</Route>
							<Route exact path='/'>
								<Redirect to='/home' />
							</Route>
							<Route exact path='/account'>
								<Account />
							</Route>
						</IonRouterOutlet>
					</IonSplitPane>
				</IonReactRouter>
			</IonApp>
		</AppContext.Provider>
	)
}

export default App
