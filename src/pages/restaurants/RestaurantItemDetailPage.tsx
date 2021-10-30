import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCheckbox,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonPage,
	IonRadio,
	IonRadioGroup,
	IonTextarea,
	IonTitle,
	IonToolbar,
	useIonRouter,
} from '@ionic/react'
import { collection, doc, setDoc } from 'firebase/firestore'
import { bagAddOutline } from 'ionicons/icons'
import { useContext, useState } from 'react'
import { useParams } from 'react-router'
import { AppContext } from '../../AppContext'
import RestaurantItemFavoriteButton from '../../components/restaurants/RestaurantItemFavoriteButton'
import RestaurantItemImgSlides from '../../components/restaurants/RestaurantItemImgSlides'
import { RestaurantBagItemModel, restaurantBagItemPrice, RestaurantItemOptionSelectableModel } from '../../data/restaurants/Restaurant'
import { firestore } from '../../Firebase'
import { decodeB64Url } from '../../util/misc'

type RestaurantItemDetailPageProps = {
	userFavoriteItems: RestaurantBagItemModel[]
}

const RestaurantItemDetailPage: React.FC<RestaurantItemDetailPageProps> = ({ userFavoriteItems }) => {
	const { restaurantPathParamB64 } = useParams<{ restaurantPathParamB64: string }>()
	const { user, userData } = useContext(AppContext)
	const router = useIonRouter()
	const { restaurantBagItemB64 } = useParams<{ restaurantBagItemB64: string }>()
	const [restaurantBagItem, setRestaurantBagItem] = useState<RestaurantBagItemModel>(decodeB64Url<RestaurantBagItemModel>(restaurantBagItemB64))

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref={`/restaurants/${restaurantPathParamB64}/menu`} />
					</IonButtons>
					<IonTitle>
						{restaurantBagItem.restaurantItem.name}: ${restaurantBagItemPrice(restaurantBagItem)}
					</IonTitle>
					<IonButtons slot='end'>
						<RestaurantItemFavoriteButton restaurantBagItem={restaurantBagItem} userFavoriteItems={userFavoriteItems} compByDetail />
						<IonButton
							onClick={async () => {
								if (userData && user) {
									const newDoc = !restaurantBagItem.uid
										? doc(collection(firestore, 'users', user.uid, 'bag'))
										: doc(firestore, 'users', user.uid, 'bag', restaurantBagItem.uid)
									await setDoc(newDoc, {
										...restaurantBagItem,
										uid: newDoc.id,
									} as RestaurantBagItemModel)

									router.goBack()
								}
							}}
						>
							<IonIcon slot='icon-only' icon={bagAddOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<RestaurantItemImgSlides restaurantItem={restaurantBagItem.restaurantItem} maxImgHeight={400} />
				<IonList lines='none'>
					{restaurantBagItem.restaurantItem.description && (
						<IonItem>
							<b slot='start'>Description:</b>
							<p style={{ whiteSpace: 'pre-wrap' }} slot='end'>
								{restaurantBagItem.restaurantItem.description}
							</p>
						</IonItem>
					)}
					<IonItem>
						<b slot='start'>Minutes Until Ready:</b>
						<p slot='end'>~{restaurantBagItem.restaurantItem.minutesToReady} mins</p>
					</IonItem>
					{/* add image slides */}
					<IonItemDivider>Order Details</IonItemDivider>
					<IonItem>
						<b>Ingredients:</b>
					</IonItem>
					{restaurantBagItem.restaurantItem.ingredients?.map((ingredient, i) => (
						<IonItem key={i}>
							<IonCheckbox
								slot='start'
								checked={ingredient.selected}
								onIonChange={(e) => {
									ingredient.selected = e.detail.checked
									setRestaurantBagItem({
										...restaurantBagItem,
									})
								}}
							/>
							<IonLabel>
								{ingredient.name}
								{!!ingredient.price && ` (+$${ingredient.price})`}
							</IonLabel>
						</IonItem>
					))}
					<IonItem>
						<b>Options:</b>
					</IonItem>
					{restaurantBagItem.restaurantItem.options.map((option, i) => (
						<IonItem key={i}>
							<p slot='start'>{option.name}</p>
							<IonList style={{ width: '100%' }}>
								<IonRadioGroup value={option.selectable.findIndex((select) => select.selected)}>
									{option.selectable.map((select, j) => (
										<IonItem key={j}>
											<IonRadio
												slot='start'
												value={j}
												onClick={() => {
													option.selectable = option.selectable.map(
														(select, k) =>
															(k === j
																? { ...select, selected: true }
																: { ...select, selected: false }) as RestaurantItemOptionSelectableModel
													)
													setRestaurantBagItem({
														...restaurantBagItem,
													})
												}}
											/>
											<IonLabel>
												{select.name}
												{!!select.price && ` (+$${select.price})`}
											</IonLabel>
										</IonItem>
									))}
								</IonRadioGroup>
							</IonList>
						</IonItem>
					))}
					<IonItem>
						<IonLabel>
							<b>Note:</b>
						</IonLabel>
						<IonTextarea
							autoGrow
							placeholder='Add special instructions, requests, etc.'
							style={{ backgroundColor: '' }}
							onIonChange={(e) =>
								setRestaurantBagItem({
									...restaurantBagItem,
									note: e.detail.value ?? '',
								})
							}
							value={restaurantBagItem.note}
						/>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	)
}

export default RestaurantItemDetailPage
