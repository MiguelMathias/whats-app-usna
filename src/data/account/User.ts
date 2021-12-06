import { doc, setDoc } from '@firebase/firestore'
import { AppContextType as AppContextType } from '../../AppContext'
import { firestore } from '../../Firebase'

export type UserDataModel = {
	uid: string
	displayName?: string
	admin?: string[]
	deviceTokens?: string[]
	subbedTopics?: string[]
}

export const setUserDoc = async (appContext: AppContextType) => {
	if (appContext.user) {
		return setDoc(doc(firestore, 'users', appContext.user.uid), appContext.userData)
	} else console.error("User isn't logged in; cannot set user data document.")
}
