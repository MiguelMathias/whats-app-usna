import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { calendarOutline, helpCircleOutline, newspaperOutline } from 'ionicons/icons'
import { Redirect, Route } from 'react-router'
import UpdatePage from '../UpdatePage'
import UpdatesPage from '../UpdatesPage'
import MFSDFeedbackPage from './MFSDFeedbackPage'
import MFSDMenuPage from './MFSDMenuPage'

const MFSDTabsPage: React.FC = () => (
	<IonTabs>
		<IonRouterOutlet>
			<Route exact path='/mfsd/menu'>
				<MFSDMenuPage />
			</Route>
			<Route exact path='/mfsd/updates'>
				<UpdatesPage dept='mfsd' />
			</Route>
			<Route exact path='/mfsd/updates/:updateUid'>
				<UpdatePage dept='mfsd' />
			</Route>
			<Route exact path='/mfsd/feedback'>
				<MFSDFeedbackPage />
			</Route>
			<Route exact path='/mfsd'>
				<Redirect exact to='/mfsd/menu' />
			</Route>
		</IonRouterOutlet>
		<IonTabBar slot='bottom'>
			<IonTabButton tab='menu' href='/mfsd/menu'>
				<IonIcon icon={calendarOutline} />
				<IonLabel>KH Menu</IonLabel>
			</IonTabButton>
			<IonTabButton tab='updates' href='/mfsd/updates'>
				<IonIcon icon={newspaperOutline} />
				<IonLabel>Updates</IonLabel>
			</IonTabButton>
			<IonTabButton tab='feedback' href='/mfsd/feedback'>
				<IonIcon icon={helpCircleOutline} />
				<IonLabel>Feedback</IonLabel>
			</IonTabButton>
		</IonTabBar>
	</IonTabs>
)

export default MFSDTabsPage
