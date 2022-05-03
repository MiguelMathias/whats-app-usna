import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonFooter,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonPage,
	IonRow,
	IonText,
	IonTitle,
	IonToolbar,
} from '@ionic/react'
import { doc, serverTimestamp } from 'firebase/firestore'
import { listAll, ref, getDownloadURL } from 'firebase/storage'
import { bedOutline, callOutline, chatbubbleOutline, chatbubblesOutline, logoVenmo, mailOutline, star, starOutline } from 'ionicons/icons'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AppContext } from '../../AppContext'
import ImgOrVidSlides from '../../components/ImgOrVidSlides'
import { setUserDataDoc, UserDataModel } from '../../data/account/User'
import { CommentModel, TradeOfferModel } from '../../data/trade/Trade'
import { firestore, storage } from '../../Firebase'
import { useSubDoc } from '../../util/hooks'
import LoadingPage from '../LoadingPage'

const TradeOfferPage: React.FC = () => {
	const { uid } = useParams<{ uid: string }>()
	const { user, userData } = useContext(AppContext)
	const [tradeOffer, _, setTradeOfferDoc] = useSubDoc<TradeOfferModel>(doc(firestore, 'trade', uid))
	const [newComment, setNewComment] = useState('')

	const [srcs, setSrcs] = useState<string[]>([])
	const [bestBidPrice, setBestBidPrice] = useState(tradeOffer?.bestBid?.price ?? 0)

	useEffect(() => {
		if (tradeOffer) {
			listAll(ref(storage, `/trade/${tradeOffer.uid}/media`)).then(async ({ items }) =>
				setSrcs(await Promise.all(items.map(async (item) => getDownloadURL(item))))
			)
			setBestBidPrice(tradeOffer.bestBid?.price ?? 0)
		}
	}, [tradeOffer?.uid])

	if (!tradeOffer) return <LoadingPage />

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref='/trade/offers' />
					</IonButtons>
					<IonTitle>
						{tradeOffer.title}: ${tradeOffer.price}
					</IonTitle>
					<IonButtons slot='end'>
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
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<ImgOrVidSlides slideSrcs={srcs} />
				<IonGrid>
					<IonRow>
						{tradeOffer.email && (
							<IonCol size='6'>
								<IonItem href={`mailto:${tradeOffer.email}`} target='_blank' style={{ borderRadius: '4px' }} detail button>
									<IonIcon slot='start' icon={mailOutline} />
									<IonLabel>{tradeOffer.email}</IonLabel>
								</IonItem>
							</IonCol>
						)}
						{tradeOffer.phoneNumber && (
							<IonCol size='6'>
								<IonItem href={`sms:${tradeOffer.phoneNumber}`} target='_blank' style={{ borderRadius: '4px' }} detail button>
									<IonIcon slot='start' icon={chatbubblesOutline} />
									<IonLabel>{tradeOffer.phoneNumber}</IonLabel>
								</IonItem>
							</IonCol>
						)}
						{tradeOffer.venmoId && (
							<IonCol size='6'>
								<IonItem
									href={`https://account.venmo.com/u/${tradeOffer.venmoId.replaceAll('@', '')}`}
									target='_blank'
									style={{ borderRadius: '4px' }}
									detail
									button
								>
									<IonIcon slot='start' icon={logoVenmo} />
									<IonLabel>{tradeOffer.venmoId}</IonLabel>
								</IonItem>
							</IonCol>
						)}
						{tradeOffer.roomNumber && (
							<IonCol size='6'>
								<IonItem style={{ borderRadius: '4px' }}>
									<IonIcon slot='start' icon={bedOutline} />
									<IonLabel>{tradeOffer.roomNumber}</IonLabel>
								</IonItem>
							</IonCol>
						)}
					</IonRow>
				</IonGrid>
				<IonList lines='none'>
					<IonItem>
						<b slot='start'>Asking Price:</b>
						<p slot='end'>${tradeOffer.price}</p>
					</IonItem>
					<IonItem>
						<b slot='start'>Category:</b>
						<p slot='end'>{tradeOffer.category}</p>
					</IonItem>
					<IonItem>
						<b slot='start'>Description:</b>
						<p style={{ whiteSpace: 'pre-wrap' }} slot='end'>
							{tradeOffer.description}
						</p>
					</IonItem>
					<IonItem>
						<b slot='start'>Date Posted:</b>
						<p slot='end'>{tradeOffer.posted?.toDate().toDateString()}</p>
					</IonItem>
					<IonItemDivider>Comments</IonItemDivider>
					{tradeOffer.comments
						?.sort((c1, c2) => +(c1.posted ?? 0) - +(c2.posted ?? 0))
						.map((comment, i) => (
							<IonItem key={i} style={{ padding: 4 }}>
								<IonLabel position='stacked'>{comment.fName}</IonLabel>
								<img slot='start' src={comment?.pfpUrl ?? undefined} width={40} height={40} style={{ borderRadius: '50%' }} />
								<p>{comment.comment}</p>
							</IonItem>
						))}
					<IonItem style={{ padding: 4 }}>
						<img slot='start' src={user?.photoURL ?? undefined} width={40} height={40} style={{ borderRadius: '50%' }} />
						<IonInput
							value={newComment}
							onIonChange={(e) => setNewComment(e.detail.value ?? '')}
							placeholder={`Post publicly as ${user?.displayName?.split(' ')[0]}`}
						/>
						<IonButton
							slot='end'
							disabled={!newComment}
							onClick={() =>
								setTradeOfferDoc({
									...tradeOffer,
									comments: [
										...(tradeOffer.comments ?? []),
										{
											fName: user?.displayName?.split(' ')[0],
											comment: newComment,
											pfpUrl: user?.photoURL ?? '',
											posted: new Date(),
										} as CommentModel,
									],
								}).finally(() => setNewComment(''))
							}
						>
							Comment
						</IonButton>
					</IonItem>
				</IonList>
			</IonContent>
			{tradeOffer.posterUid !== user?.uid && (
				<IonFooter>
					<IonItem>
						<IonLabel slot='start'>$</IonLabel>
						<IonInput
							min={tradeOffer.bestBid?.price ?? 0}
							type='number'
							inputMode='decimal'
							value={bestBidPrice}
							onIonChange={(e) => setBestBidPrice(+(e.detail.value ?? 0))}
						/>
						<IonButton
							slot='end'
							disabled={tradeOffer.bestBid?.price === 0 ? bestBidPrice < 0 : bestBidPrice <= (tradeOffer.bestBid?.price ?? 0)}
							onClick={() => setTradeOfferDoc({ ...tradeOffer, bestBid: { price: bestBidPrice, email: user?.email ?? '' } } as TradeOfferModel)}
						>
							Make Bid
						</IonButton>
					</IonItem>
				</IonFooter>
			)}
		</IonPage>
	)
}

export default TradeOfferPage
