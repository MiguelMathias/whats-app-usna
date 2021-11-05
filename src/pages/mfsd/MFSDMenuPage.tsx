import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonPopover,
} from '@ionic/react'
import { informationCircleOutline } from 'ionicons/icons'
import React, { useState } from 'react'
import AccordionIonItem from '../../components/AccordionIonItem'
import { dayTotals, MacrosModel, mealTotals, WeekModel } from '../../data/mfsd/MFSD'
import { useSubDoc } from '../../util/hooks'

const MFSDMenuPage: React.FC = () => {
	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
	const [week] = useSubDoc<WeekModel>('mfsd', 'khMenu')
	const [macrosForInfo, setMacrosForInfo] = useState<MacrosModel>()
	const [showInfoPopover, dismissInfoPopover] = useIonPopover(
		<IonList>
			<IonItem>
				<IonLabel>Calories (g)</IonLabel>
				<IonLabel slot='end'>{macrosForInfo?.calories}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Fat (g)</IonLabel>
				<IonLabel slot='end'>{macrosForInfo?.fatG}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Carbs (g)</IonLabel>
				<IonLabel slot='end'>{macrosForInfo?.carbsG}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Protein (g)</IonLabel>
				<IonLabel slot='end'>{macrosForInfo?.proteinG}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Fiber (g)</IonLabel>
				<IonLabel slot='end'>{macrosForInfo?.fiberG}</IonLabel>
			</IonItem>
		</IonList>
	)

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>King Hall Menu</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					{week?.days.map((day, i) => (
						<AccordionIonItem
							key={i}
							header={day.name}
							initiallyOpen={
								i < days.length && day.name.toLowerCase().includes(days[new Date().getDay()])
							}
						>
							<IonList>
								{[day.breakfast, day.lunch, day.dinner].map((meal, i) => (
									<React.Fragment key={i}>
										<IonItemDivider>
											<IonLabel>{['Breakfast', 'Lunch', 'Dinner'][i]}:</IonLabel>
											{meal !== "King's Court" && meal?.mealItems.length > 0 && (
												<IonButtons slot='end'>
													<IonButton
														onClick={(e) => {
															setMacrosForInfo(mealTotals(meal))
															showInfoPopover({
																event: e.nativeEvent,
																showBackdrop: true,
																onDidDismiss: () => {
																	dismissInfoPopover()
																	setMacrosForInfo(undefined)
																},
															})
														}}
													>
														<IonIcon slot='icon-only' icon={informationCircleOutline} />
													</IonButton>
												</IonButtons>
											)}
										</IonItemDivider>
										{meal === "King's Court" || meal?.mealItems.length === 0 ? (
											<IonItem>
												<IonLabel>{meal}</IonLabel>
											</IonItem>
										) : (
											meal?.mealItems.map((mealItem, j) => (
												<IonItem key={j}>
													<p>{mealItem.name}</p>
													{!!mealItem.macros && (
														<IonButtons slot='end'>
															<IonButton
																onClick={(e) => {
																	if (!mealItem.macros) return
																	setMacrosForInfo(mealItem.macros)
																	showInfoPopover({
																		event: e.nativeEvent,
																		onDidDismiss: () => {
																			dismissInfoPopover()
																			setMacrosForInfo(undefined)
																		},
																	})
																}}
															>
																<IonIcon
																	slot='icon-only'
																	icon={informationCircleOutline}
																/>
															</IonButton>
														</IonButtons>
													)}
												</IonItem>
											))
										)}
									</React.Fragment>
								))}
								{!![day.breakfast, day.lunch, day.dinner].find(
									(day) => day !== "King's Court" && day?.mealItems.length > 0
								) && (
									<IonItemDivider>
										<IonLabel>Daily Totals</IonLabel>
										<IonButtons slot='end'>
											<IonButton
												onClick={(e) => {
													setMacrosForInfo(dayTotals(day))
													showInfoPopover({
														event: e.nativeEvent,
														onDidDismiss: () => {
															dismissInfoPopover()
															setMacrosForInfo(undefined)
														},
													})
												}}
											>
												<IonIcon slot='icon-only' icon={informationCircleOutline} />
											</IonButton>
										</IonButtons>
									</IonItemDivider>
								)}
							</IonList>
						</AccordionIonItem>
					))}
				</IonList>
			</IonContent>
		</IonPage>
	)
}

export default MFSDMenuPage
