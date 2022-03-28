import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonList,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react'
import { doc } from 'firebase/firestore'
import { listAll, ref, getDownloadURL } from 'firebase/storage'
import { star, starOutline } from 'ionicons/icons'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AppContext } from '../../AppContext'
import ImgOrVidSlides from '../../components/ImgOrVidSlides'
import { setUserDataDoc, UserDataModel } from '../../data/account/User'
import { TradeOfferModel } from '../../data/trade/Trade'
import { firestore, storage } from '../../Firebase'
import { useSubDoc } from '../../util/hooks'
import LoadingPage from '../LoadingPage'

const TradeOfferPage: React.FC = () => {
	const { uid } = useParams<{ uid: string }>()
	const { user, userData } = useContext(AppContext)
	const [tradeOffer] = useSubDoc<TradeOfferModel>(doc(firestore, 'trade', uid))

	const [srcs, setSrcs] = useState<string[]>([])

	useEffect(() => {
		if (tradeOffer)
			listAll(ref(storage, `/trade/${tradeOffer.uid}/media`)).then(async ({ items }) =>
				setSrcs(await Promise.all(items.map(async (item) => getDownloadURL(item))))
			)
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
				<IonList lines='none'>
					<IonItem>
						<b slot='start'>Price:</b>
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
					{(tradeOffer.email || tradeOffer.phoneNumber || tradeOffer.venmoId || tradeOffer.roomNumber) && (
						<IonItemDivider>Contact Information</IonItemDivider>
					)}
					{tradeOffer.email && (
						<IonItem>
							<b slot='start'>Email:</b>
							<p slot='end'>
								<a href={`mailto:${tradeOffer.email}`}>{tradeOffer.email}</a>
							</p>
						</IonItem>
					)}
					{tradeOffer.phoneNumber && (
						<IonItem>
							<b slot='start'>Phone Number:</b>
							<p slot='end'>
								<a href={`tel:${tradeOffer.phoneNumber}`}>{tradeOffer.phoneNumber}</a>
							</p>
						</IonItem>
					)}
					{tradeOffer.venmoId && (
						<IonItem>
							<b slot='start'>Venmo ID:</b>
							<p slot='end'>
								<a href={`https://account.venmo.com/u/${tradeOffer.venmoId}`}>{tradeOffer.venmoId}</a>
							</p>
						</IonItem>
					)}
					{tradeOffer.roomNumber && (
						<IonItem>
							<b slot='start'>Room Number:</b>
							<p slot='end'>{tradeOffer.roomNumber}</p>
						</IonItem>
					)}
				</IonList>
			</IonContent>
		</IonPage>
	)
}

export default TradeOfferPage
