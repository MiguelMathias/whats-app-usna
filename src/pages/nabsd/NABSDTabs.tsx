import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { homeOutline, newspaperOutline } from 'ionicons/icons'
import { Redirect, Route } from 'react-router'
import HomePlaceholder from '../Home'
import UpdatePage from '../UpdatePage'
import UpdatesPage from '../UpdatesPage'

const NABSDTabs: React.FC = () => (
	<IonTabs>
		<IonRouterOutlet>
			<Route exact path='/nabsd/home'>
				<HomePlaceholder title='NABSD Home' />
			</Route>
			<Route exact path='/nabsd/updates'>
				<UpdatesPage dept='nabsd' />
			</Route>
			<Route exact path='/nabsd/updates/:updateUid'>
				<UpdatePage dept='nabsd' />
			</Route>
			<Route exact path='/nabsd'>
				<Redirect exact to='/nabsd/home' />
			</Route>
		</IonRouterOutlet>
		<IonTabBar slot='bottom'>
			<IonTabButton tab='home' href='/nabsd/home'>
				<IonIcon icon={homeOutline} />
				<IonLabel>Home</IonLabel>
			</IonTabButton>
			<IonTabButton tab='updates' href='/nabsd/updates'>
				<IonIcon icon={newspaperOutline} />
				<IonLabel>Updates</IonLabel>
			</IonTabButton>
		</IonTabBar>
	</IonTabs>
)

export default NABSDTabs
