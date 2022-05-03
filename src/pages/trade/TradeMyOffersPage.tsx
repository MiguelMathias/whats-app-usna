import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react'
import { collection, orderBy, query, where } from 'firebase/firestore'
import { addOutline } from 'ionicons/icons'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import TradeOffersGrid from '../../components/trade/TradeOffersGrid'
import { TradeOfferModel } from '../../data/trade/Trade'
import { firestore } from '../../Firebase'
import { useSubCollection } from '../../util/hooks'

const TradeMyOffersPage: React.FC = () => {
	const { user } = useContext(AppContext)
	const [tradeOffers, _, limit, incLimit] = useSubCollection<TradeOfferModel>(
		query(collection(firestore, 'trade'), where('posterUid', '==', user?.uid ?? 'nil'), orderBy('posted', 'desc')),
		[user?.uid],
		30
	)

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>My Offers</IonTitle>
					<IonButtons slot='end'>
						<IonButton routerLink='/trade/my-offers/add'>
							<IonIcon slot='icon-only' icon={addOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<TradeOffersGrid isMine={true} tradeOffers={tradeOffers} />
				<IonInfiniteScroll onIonInfinite={incLimit} threshold='100px' disabled={tradeOffers.length < limit}>
					<IonInfiniteScrollContent loadingSpinner='dots' />
				</IonInfiniteScroll>
			</IonContent>
		</IonPage>
	)
}

export default TradeMyOffersPage
