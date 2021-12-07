const extract = require('mention-hashtag')

export type WeekModel = {
	days: DayModel[]
	lastUpdated: number
}

export type DayModel = {
	name: string
	breakfast?: MealModel
	lunch?: MealModel
	dinner?: MealModel
}

export type MealModel =
	| "King's Court"
	| {
			mealItems: MealItemModel[]
	  }

export type MealItemModel = {
	name: string
	macros?: MacrosModel
	allergens: string
}

export type MacrosModel = {
	calories?: number
	fatG?: number
	carbsG?: number
	fiberG?: number
	proteinG?: number
}

export const mealTotals = (meal?: MealModel) =>
	meal === "King's Court" || !meal
		? ({} as MacrosModel)
		: meal?.mealItems
				.map((mealItem) => mealItem.macros)
				.reduce(
					(prev, cur) =>
						({
							calories: (prev?.calories ?? 0) + (cur?.calories ?? 0),
							fatG: (prev?.fatG ?? 0) + (cur?.fatG ?? 0),
							carbsG: (prev?.carbsG ?? 0) + (cur?.carbsG ?? 0),
							fiberG: (prev?.fiberG ?? 0) + (cur?.fiberG ?? 0),
							proteinG: (prev?.proteinG ?? 0) + (cur?.proteinG ?? 0),
						} as MacrosModel)
				)

export const dayTotals = (day: DayModel) =>
	[
		day.breakfast === "King's Court" ? ({} as MacrosModel) : mealTotals(day.breakfast),
		day.lunch === "King's Court" ? ({} as MacrosModel) : mealTotals(day.lunch),
		day.dinner === "King's Court" ? ({} as MacrosModel) : mealTotals(day.dinner),
	].reduce(
		(prev, cur) =>
			({
				calories: (prev?.calories ?? 0) + (cur?.calories ?? 0),
				fatG: (prev?.fatG ?? 0) + (cur?.fatG ?? 0),
				carbsG: (prev?.carbsG ?? 0) + (cur?.carbsG ?? 0),
				fiberG: (prev?.fiberG ?? 0) + (cur?.fiberG ?? 0),
				proteinG: (prev?.proteinG ?? 0) + (cur?.proteinG ?? 0),
			} as MacrosModel)
	)

export const updateCaptionHTML = (caption?: string) => {
	const { mentions, hashtags }: { mentions: string[]; hashtags: string[] } = extract(caption, { unique: true, type: 'all' })
	let newCaption = caption
	for (const mention of mentions)
		newCaption = newCaption?.replaceAll(mention, `<a href="https://www.instagram.com/${mention.replaceAll('@', '')}" target="_blank">${mention}</a>`)
	for (const hashtag of hashtags)
		newCaption = newCaption?.replaceAll(
			hashtag,
			`<a href="https://www.instagram.com/explore/tags/${hashtag.replaceAll('#', '')}" target="_blank">${hashtag}</a>`
		)
	return newCaption
}
