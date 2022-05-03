import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { collection, orderBy, OrderByDirection, query, where } from 'firebase/firestore'
import { gridOutline, readerOutline, starOutline } from 'ionicons/icons'
import { useContext, useState } from 'react'
import { Redirect, Route } from 'react-router'
import { AppContext } from '../../AppContext'
import { SortType } from '../../data/trade/Trade'
import { firestore } from '../../Firebase'
import { chunkArray } from '../../util/misc'
import TradeMyOfferPage from './TradeMyOfferPage'
import TradeMyOffersPage from './TradeMyOffersPage'
import TradeOfferPage from './TradeOfferPage'
import TradeOffersPage from './TradeOffersPage'

const TradeTabs: React.FC = () => {
	const { userData } = useContext(AppContext)
	const [sort, setSort] = useState<SortType>('posted-desc')

	return (
		<IonTabs>
			<IonRouterOutlet>
				<Route exact path='/trade'>
					<Redirect to='/trade/offers' />
				</Route>
				<Route exact path='/trade/offers'>
					<TradeOffersPage
						sort={sort}
						setSort={setSort}
						query={query(
							collection(firestore, 'trade'),
							orderBy(sort.split('-')[0], sort.split('-')[1] as OrderByDirection),
							where('active', '==', true)
						)}
					/>
				</Route>
				<Route exact path='/trade/favorites'>
					<TradeOffersPage
						sort={sort}
						setSort={setSort}
						query={chunkArray(userData?.tradeFavorites ?? [], 10).reduce(
							(prev, cur) => query(prev, where('uid', 'in', cur)),
							query(
								collection(firestore, 'trade'),
								orderBy(sort.split('-')[0], sort.split('-')[1] as OrderByDirection),
								where('active', '==', true)
							)
						)}
					/>
				</Route>
				<Route exact path='/trade/my-offers'>
					<TradeMyOffersPage />
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

export default TradeTabs
