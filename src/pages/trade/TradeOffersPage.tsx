import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonMenuButton,
	IonPage,
	IonRadio,
	IonRadioGroup,
	IonTitle,
	IonToggle,
	IonToolbar,
	useIonModal,
} from '@ionic/react'
import { arrowDownOutline, arrowUpOutline, checkmarkOutline, optionsOutline, searchOutline, swapVerticalOutline } from 'ionicons/icons'
import { useRef, useState } from 'react'
import TradeOffersGrid from '../../components/trade/TradeOffersGrid'
import { SortType, sortTypes, tradeCategories, TradeCategoryModel, TradeOfferModel } from '../../data/trade/Trade'
import { capitalize } from '../../util/misc'

type TradeOffersPageProps = {
	tradeOffers: TradeOfferModel[]
	sort: SortType
	setSort: (sort: SortType) => void
}

const TradeOffersPage: React.FC<TradeOffersPageProps> = ({ tradeOffers, sort, setSort }) => {
	const [categories, setCategories] = useState<TradeCategoryModel[]>(tradeCategories.map((c) => c))
	const [searchText, setSearchText] = useState('')

	const headerRef = useRef<HTMLIonHeaderElement>(null)

	const [showSortModal, dismissSortModal] = useIonModal(
		<>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Sort</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => dismissSortModal()}>
							<IonIcon slot='icon-only' icon={checkmarkOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					<IonRadioGroup value={sort} onIonChange={(e) => setSort(e.detail.value)}>
						{sortTypes.map((sortType, i) => (
							<IonItem key={i}>
								<IonLabel>
									{capitalize(sortType.split('-')[0])} <IonIcon icon={sortType.split('-')[1] === 'asc' ? arrowUpOutline : arrowDownOutline} />
								</IonLabel>
								<IonRadio value={sortType} />
							</IonItem>
						))}
					</IonRadioGroup>
				</IonList>
			</IonContent>
		</>
	)

	const [showCategoryModal, dismissCategoryModal] = useIonModal(
		<>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Categories</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => dismissCategoryModal()}>
							<IonIcon slot='icon-only' icon={checkmarkOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					<IonItem>
						<IonButton slot='end' onClick={() => setCategories(categories.length === tradeCategories.length ? [] : tradeCategories.map((c) => c))}>
							{categories.length === tradeCategories.length ? 'Deselect' : 'Select'} All
						</IonButton>
					</IonItem>
					{tradeCategories.map((category, i) => (
						<IonItem key={i}>
							<IonLabel slot='start'>{category}</IonLabel>
							<IonToggle
								slot='end'
								checked={categories.includes(category)}
								onIonChange={(e) =>
									!e.detail.checked
										? setCategories((categories) => categories.filter((cat) => cat !== category))
										: setCategories((categories) => categories.concat(category))
								}
							/>
						</IonItem>
					))}
				</IonList>
			</IonContent>
		</>
	)

	return (
		<IonPage>
			<IonHeader ref={headerRef}>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Offers</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => showSortModal({ presentingElement: headerRef.current ?? undefined })}>
							<IonIcon slot='icon-only' icon={swapVerticalOutline} />
						</IonButton>
						<IonButton onClick={() => showCategoryModal({ presentingElement: headerRef.current ?? undefined })}>
							<IonIcon slot='icon-only' icon={optionsOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonItem color='light'>
					<IonIcon slot='start' icon={searchOutline} />
					<IonInput inputMode='search' type='search' enterkeyhint='search' onIonChange={(e) => setSearchText(e.detail.value ?? '')} />
				</IonItem>
				<TradeOffersGrid tradeOffers={tradeOffers} searchText={searchText} categories={categories} />
			</IonContent>
		</IonPage>
	)
}

export default TradeOffersPage
