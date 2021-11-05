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
	IonListHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonPopover,
} from '@ionic/react'
import { alertCircleOutline, informationCircleOutline } from 'ionicons/icons'
import React, { useState } from 'react'
import AccordionIonItem from '../../components/AccordionIonItem'
import { dayTotals, MacrosModel, mealTotals, WeekModel } from '../../data/mfsd/MFSD'
import { useSubDoc } from '../../util/hooks'
import { capitalize } from '../../util/misc'

const MFSDMenuPage: React.FC = () => {
	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
	const [week] = useSubDoc<WeekModel>('mfsd', 'khMenu')
	const [macrosForPopover, setMacrosForPopover] = useState<MacrosModel>()
	const [showMacroPopover, dismissMacroPopover] = useIonPopover(
		<IonList>
			<IonListHeader>
				<h3>
					<b>Macros</b>
				</h3>
			</IonListHeader>
			<IonItem>
				<IonLabel>Calories (g)</IonLabel>
				<IonLabel slot='end'>{macrosForPopover?.calories}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Fat (g)</IonLabel>
				<IonLabel slot='end'>{macrosForPopover?.fatG}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Carbs (g)</IonLabel>
				<IonLabel slot='end'>{macrosForPopover?.carbsG}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Protein (g)</IonLabel>
				<IonLabel slot='end'>{macrosForPopover?.proteinG}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Fiber (g)</IonLabel>
				<IonLabel slot='end'>{macrosForPopover?.fiberG}</IonLabel>
			</IonItem>
		</IonList>
	)
	const [allergensForPopover, setAllergensForPopover] = useState<string>()
	const [showAllergensPopover, dismissAllergensPopover] = useIonPopover(
		<IonList>
			<IonListHeader>
				<h3>
					<b>Allergens</b>
				</h3>
			</IonListHeader>
			{allergensForPopover?.split(',').map((allergen, i) => (
				<IonItem key={i}>
					<IonLabel>{capitalize(allergen.trim())}</IonLabel>
				</IonItem>
			))}
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
			<IonContent fullscreen>
				<IonList lines='full'>
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
										<IonItem lines='inset'>
											<h2>
												<b>{['Breakfast', 'Lunch', 'Dinner'][i]}</b>
											</h2>
											{meal !== "King's Court" && (meal?.mealItems.length ?? 0) > 0 && (
												<IonButtons slot='end'>
													<IonButton
														onClick={(e) => {
															setMacrosForPopover(mealTotals(meal))
															showMacroPopover({
																event: e.nativeEvent,
																showBackdrop: true,
																onDidDismiss: () => {
																	dismissMacroPopover()
																	setMacrosForPopover(undefined)
																},
															})
														}}
													>
														<IonIcon
															color='primary'
															slot='icon-only'
															icon={informationCircleOutline}
														/>
													</IonButton>
												</IonButtons>
											)}
										</IonItem>
										{meal === "King's Court" || !meal || meal?.mealItems.length === 0 ? (
											<IonItem lines='none'>
												<IonLabel>{meal}</IonLabel>
											</IonItem>
										) : (
											meal?.mealItems.map((mealItem, j) => (
												<IonItem key={j} lines='none'>
													<p>{mealItem.name}</p>
													<IonButtons slot='end'>
														{!!mealItem.allergens && (
															<IonButton
																onClick={(e) => {
																	if (!mealItem.allergens) return
																	setAllergensForPopover(mealItem.allergens)
																	showAllergensPopover({
																		event: e.nativeEvent,
																		onDidDismiss: () => {
																			dismissAllergensPopover()
																			setAllergensForPopover(undefined)
																		},
																	})
																}}
															>
																<IonIcon
																	slot='icon-only'
																	icon={alertCircleOutline}
																	color='danger'
																/>
															</IonButton>
														)}
														{!!mealItem.macros && (
															<IonButton
																onClick={(e) => {
																	if (!mealItem.macros) return
																	setMacrosForPopover(mealItem.macros)
																	showMacroPopover({
																		event: e.nativeEvent,
																		onDidDismiss: () => {
																			dismissMacroPopover()
																			setMacrosForPopover(undefined)
																		},
																	})
																}}
															>
																<IonIcon
																	slot='icon-only'
																	icon={informationCircleOutline}
																	color='primary'
																/>
															</IonButton>
														)}
													</IonButtons>
												</IonItem>
											))
										)}
									</React.Fragment>
								))}
								{!![day.breakfast, day.lunch, day.dinner].find(
									(meal) => meal !== "King's Court" && (meal?.mealItems.length ?? 0) > 0
								) && (
									<IonItemDivider>
										<IonLabel color='dark'>
											<b>Daily Totals</b>
										</IonLabel>
										<IonButtons slot='end'>
											<IonButton
												onClick={(e) => {
													setMacrosForPopover(dayTotals(day))
													showMacroPopover({
														event: e.nativeEvent,
														onDidDismiss: () => {
															dismissMacroPopover()
															setMacrosForPopover(undefined)
														},
													})
												}}
											>
												<IonIcon
													color='primary'
													slot='icon-only'
													icon={informationCircleOutline}
												/>
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
