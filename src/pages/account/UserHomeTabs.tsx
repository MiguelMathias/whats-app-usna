import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { newspaperOutline, personOutline } from 'ionicons/icons'
import { useContext } from 'react'
import { Redirect, Route } from 'react-router'
import { AppContext } from '../../AppContext'
import UpdatePage from '../UpdatePage'
import UpdatesPage from '../UpdatesPage'
import ProfilePage from './ProfilePage'

const UserHomeTabs: React.FC = () => (
	<IonTabs>
		<IonRouterOutlet>
			<Route exact path='/mids'>
				<Redirect exact to='/mids/profile' />
			</Route>
			<Route exact path='/mids/updates'>
				<UpdatesPage title='Account Updates' dept='mids' />
			</Route>
			<Route exact path='/mids/updates/:updateUid'>
				<UpdatePage title='Account Update' dept='mids' />
			</Route>
			<Route exact path='/mids/profile'>
				<ProfilePage />
			</Route>
		</IonRouterOutlet>
		<IonTabBar slot='bottom'>
			<IonTabButton tab='profile' href='/mids/profile'>
				<IonIcon icon={personOutline} />
				<IonLabel>Profile</IonLabel>
			</IonTabButton>
			<IonTabButton tab='feed' href='/mids/updates'>
				<IonIcon icon={newspaperOutline} />
				<IonLabel>Updates</IonLabel>
			</IonTabButton>
		</IonTabBar>
	</IonTabs>
)
export default UserHomeTabs
