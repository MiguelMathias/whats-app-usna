import { Timestamp } from '@firebase/firestore'

export type UpdateModel = {
	uid: string
	dept: string
	category?: string
	title?: string
	caption?: string
	posted?: Timestamp
	midsAndCos: string[]
}
