import { doc, setDoc } from '@firebase/firestore'
import { User } from 'firebase/auth'
import { firestore } from '../../Firebase'

export type UserDataModel = {
	uid: string
	email: string
	displayName?: string
	company?: string
	roomNumber?: string
	venmoId?: string
	phoneNumber?: string
	deviceTokens?: string[]
	subbedTopics?: string[]
	stripeId?: string
	tradeFavorites?: string[]
}

export const setUserDataDoc = async (user?: User, userData?: UserDataModel) => {
	if (user && userData) {
		return setDoc(doc(firestore, 'users', user.uid), userData)
	} else console.error("User isn't logged in; cannot set user data document.")
}
