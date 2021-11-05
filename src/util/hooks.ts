import { collection, onSnapshot } from '@firebase/firestore'
import { doc } from 'firebase/firestore'
import { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { firestore } from '../Firebase'

export const useForceUpdate = () => {
	const [forceUpdate, setForceUpdate] = useState(false)
	return () => {
		setForceUpdate(!forceUpdate)
	}
}

export const useSubDoc = <T>(path: string, ...pathSegments: string[]): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] => {
	const [docData, setDocData] = useState<T>()
	useEffectOnce(() => onSnapshot(doc(firestore, path, ...pathSegments), (snapshot) => setDocData(snapshot.data() as T)))
	return [docData, setDocData]
}

export const useSubCollection = <T>(path: string, ...pathSegments: string[]): [T[], React.Dispatch<React.SetStateAction<T[]>>] => {
	const [collectionData, setCollectionData] = useState<T[]>([])
	useEffectOnce(() => onSnapshot(collection(firestore, path, ...pathSegments), (snapshot) => setCollectionData(snapshot.docs.map((doc) => doc.data() as T))))
	return [collectionData, setCollectionData]
}
