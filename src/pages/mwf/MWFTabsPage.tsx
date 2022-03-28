import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { homeOutline, newspaperOutline } from 'ionicons/icons'
import { Redirect, Route } from 'react-router'
import HomePlaceholder from '../Home'
import UpdatePage from '../UpdatePage'
import UpdatesPage from '../UpdatesPage'

const MWFTabsPage: React.FC = () => (
	<IonTabs>
		<IonRouterOutlet>
			<Route exact path='/mwf/home'>
				<HomePlaceholder title='MWF Home' />
			</Route>
			<Route exact path='/mwf/updates'>
				<UpdatesPage dept='mwf' />
			</Route>
			<Route exact path='/mwf/updates/:updateUid'>
				<UpdatePage dept='mwf' />
			</Route>
			<Route exact path='/mwf'>
				<Redirect exact to='/mwf/home' />
			</Route>
		</IonRouterOutlet>
		<IonTabBar slot='bottom'>
			<IonTabButton tab='home' href='/mwf/home'>
				<IonIcon icon={homeOutline} />
				<IonLabel>Home</IonLabel>
			</IonTabButton>
			<IonTabButton tab='updates' href='/mwf/updates'>
				<IonIcon icon={newspaperOutline} />
				<IonLabel>Updates</IonLabel>
			</IonTabButton>
		</IonTabBar>
	</IonTabs>
)

export default MWFTabsPage
