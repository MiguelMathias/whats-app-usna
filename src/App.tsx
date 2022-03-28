import { onSnapshot, setDoc, where } from '@firebase/firestore'
import { getToken } from '@firebase/messaging'
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
import React, { useEffect, useMemo, useState } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AppContext, AppContextType } from './AppContext'
import SideMenu from './components/SideMenu'
import { UserDataModel } from './data/account/User'
import { RestaurantModel } from './data/restaurants/Restaurant'
import { auth, firestore, messaging } from './Firebase'
import Account from './pages/account/Account'
import MFSDTabsPage from './pages/mfsd/MFSDTabsPage'
import MWFTabsPage from './pages/mwf/MWFTabsPage'
import NABSDTabsPage from './pages/nabsd/NABSDTabsPage'
import RestaurantTabsPage from './pages/restaurants/RestaurantTabsPage'
import TradeTabsPage from './pages/trade/TradeTabsPage'
/* Theme variables */
import './theme/variables.css'
import { useSubCollection } from './util/hooks'

const App: React.FC = () => {
	const [user, setUser] = useState<User | undefined>(undefined)
	const [userData, setUserData] = useState<UserDataModel | undefined>(undefined)
	const [restaurants] = useSubCollection<RestaurantModel>(query(collection(firestore, 'restaurants'), where('active', '==', true)))
	const [showBadAccountToast, _] = useIonToast()

	const appContextProviderValue = {
		user,
		setUser,
		userData,
		setUserData,
	} as AppContextType

	useMemo(() => {
		getToken(messaging, { vapidKey: 'BC-1nDNCDMR549Bp7BXx2zJzPYUOJV-XvggFKRZXtGKtVEHBLP-6l6nVBxFav3ePd6tnsCisSBCsp5xnCEAxHSk' })
			.then((currentToken) => {
				if (currentToken && !userData?.deviceTokens?.includes(currentToken)) {
					setUserData((userData) => ({ ...userData, deviceTokens: [...(userData?.deviceTokens ?? []), currentToken] } as UserDataModel))
				} else if (!currentToken) console.log('Need permission for notifs.')
			})
			.catch((err) => console.error(err))
	}, [userData?.uid])

	useEffect(() => {
		if (user) {
			const userDataUnsub = onSnapshot(doc(firestore, 'users', user.uid), (snapshot) => {
				if (snapshot.exists()) {
					const newUserData = snapshot.data() as UserDataModel
					if (!newUserData.uid) newUserData.uid = user.uid
					if (!newUserData.displayName) newUserData.displayName = user.displayName || undefined
					setUserData(newUserData)
				} else
					setDoc(doc(firestore, 'users', user.uid), {
						uid: user.uid,
						email: user.email ?? '',
						displayName: user.displayName ?? '',
						subbedTopics: ['mfsd', 'mwf', 'nabsd', 'mids'],
						company: '',
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

	return (
		<AppContext.Provider value={appContextProviderValue}>
			<IonApp>
				<IonReactRouter>
					<IonSplitPane contentId='main'>
						<SideMenu restaurants={restaurants} />
						<IonRouterOutlet id='main'>
							<Route exact path='/'>
								<Redirect to='/mids' />
							</Route>
							<Route path='/mids'>
								<Account />
							</Route>
							<Route path='/mfsd'>
								<MFSDTabsPage />
							</Route>
							<Route path='/mwf'>
								<MWFTabsPage />
							</Route>
							<Route path='/nabsd'>
								<NABSDTabsPage />
							</Route>
							<Route path='/trade'>
								<TradeTabsPage />
							</Route>
							<Route path={`/restaurants/:restaurantPathParamB64`}>
								<RestaurantTabsPage restaurants={restaurants} />
							</Route>
						</IonRouterOutlet>
					</IonSplitPane>
				</IonReactRouter>
			</IonApp>
		</AppContext.Provider>
	)
}

export default App
