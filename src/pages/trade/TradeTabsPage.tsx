import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { collection, endAt, limit, orderBy, OrderByDirection, query, where } from 'firebase/firestore'
import { gridOutline, readerOutline, starOutline } from 'ionicons/icons'
import { useContext, useState } from 'react'
import { Redirect, Route } from 'react-router'
import { AppContext } from '../../AppContext'
import { SortType, TradeOfferModel } from '../../data/trade/Trade'
import { firestore } from '../../Firebase'
import { useSubCollection } from '../../util/hooks'
import TradeMyOfferPage from './TradeMyOfferPage'
import TradeMyOffersPage from './TradeMyOffersPage'
import TradeOfferPage from './TradeOfferPage'
import TradeOffersPage from './TradeOffersPage'

const TradeTabsPage: React.FC = () => {
	const { userData } = useContext(AppContext)
	const [sort, setSort] = useState<SortType>('posted-desc')
	const [tradeCursor, setTradeCursor] = useState(5)
	const [activeTradeOffers] = useSubCollection<TradeOfferModel>(
		query(
			collection(firestore, 'trade'),
			orderBy(sort.split('-')[0], sort.split('-')[1] as OrderByDirection),
			where('active', '==', true)
			//limit(tradeCursor)
		),
		[sort, tradeCursor]
	)
	return (
		<IonTabs>
			<IonRouterOutlet>
				<Route exact path='/trade'>
					<Redirect to='/trade/offers' />
				</Route>
				<Route exact path='/trade/offers'>
					<TradeOffersPage sort={sort} tradeOffers={activeTradeOffers} setSort={setSort} />
				</Route>
				<Route exact path='/trade/favorites'>
					<TradeOffersPage
						sort={sort}
						tradeOffers={activeTradeOffers.filter((tradeOffer) => userData?.tradeFavorites?.includes(tradeOffer.uid))}
						setSort={setSort}
					/>
				</Route>
				<Route exact path='/trade/my-offers'>
					<TradeMyOffersPage onInfinite={() => setTradeCursor((tradeCursor) => tradeCursor + 12)} />
				</Route>
				<Route exact path='/trade/offers/:uid'>
					<TradeOfferPage />
				</Route>
				<Route exact path='/trade/my-offers/:uid'>
					<TradeMyOfferPage />
				</Route>
			</IonRouterOutlet>
			<IonTabBar slot='bottom'>
				<IonTabButton tab='offers' href='/trade/offers'>
					<IonIcon icon={gridOutline} />
					<IonLabel>Offers</IonLabel>
				</IonTabButton>
				<IonTabButton tab='favorites' href='/trade/favorites'>
					<IonIcon icon={starOutline} />
					<IonLabel>Favorites</IonLabel>
				</IonTabButton>
				<IonTabButton tab='my-offers' href='/trade/my-offers'>
					<IonIcon icon={readerOutline} />
					<IonLabel>My Offers</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs>
	)
}

export default TradeTabsPage
