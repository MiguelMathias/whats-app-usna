import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonLabel, IonRouterLink } from '@ionic/react'
import { getDownloadURL, listAll, ref } from 'firebase/storage'
import { Markup } from 'interweave'
import { star, starOutline } from 'ionicons/icons'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import { setUserDataDoc, UserDataModel } from '../../data/account/User'
import { updateCaptionHTML } from '../../data/mfsd/MFSD'
import { TradeOfferModel } from '../../data/trade/Trade'
import { storage } from '../../Firebase'
import ImgOrVidSlides from '../ImgOrVidSlides'
import '../restaurants/RestaurantItemCard.scss'

type TradeOfferCardProps = {
	isMine?: boolean
	tradeOffer: TradeOfferModel
}

const TradeOfferCard: React.FC<TradeOfferCardProps> = ({ isMine, tradeOffer }) => {
	const { user, userData } = useContext(AppContext)
	const [srcs, setSrcs] = useState<string[]>([])

	useEffect(() => {
		listAll(ref(storage, `/trade/${tradeOffer.uid}/media`)).then(async ({ items }) =>
			setSrcs(await Promise.all(items.map(async (item) => getDownloadURL(item))))
		)
	}, [tradeOffer.uid])

	return (
		<IonCard className='card' style={{ minWidth: '95%' }}>
			<ImgOrVidSlides slideSrcs={srcs} />
			<IonCardHeader>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<IonRouterLink routerLink={`/trade/${isMine ? 'my-' : ''}offers/${tradeOffer.uid}`}>
						<IonCardTitle class='ion-text-left'>{tradeOffer.title}</IonCardTitle>
					</IonRouterLink>
					<IonButtons>
						<IonButton
							shape='round'
							fill='solid'
							color='transparent'
							onClick={() =>
								setUserDataDoc(user, {
									...userData,
									tradeFavorites: userData?.tradeFavorites?.includes(tradeOffer.uid)
										? userData?.tradeFavorites?.filter((uid) => tradeOffer.uid !== uid)
										: (userData?.tradeFavorites ?? []).concat(tradeOffer.uid),
								} as UserDataModel)
							}
						>
							<IonIcon color='dark' slot='icon-only' icon={userData?.tradeFavorites?.includes(tradeOffer.uid) ? star : starOutline} />
						</IonButton>
					</IonButtons>
				</div>
			</IonCardHeader>
			<IonCardContent>
				<IonLabel style={{ whitespace: 'pre-wrap' }} class='ion-text-wrap'>
					<div style={{ whiteSpace: 'pre-wrap' }}>
						<Markup content={updateCaptionHTML(tradeOffer.description)} />
					</div>
				</IonLabel>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'end',
					}}
				>
					<IonLabel color='dark'>{isMine ? `Best Bid: $${tradeOffer.bestBid?.price}` ?? `$${0}` : `$${tradeOffer.price}`}</IonLabel>
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default TradeOfferCard
