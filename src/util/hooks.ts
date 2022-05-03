import { CollectionReference, DocumentData, DocumentReference, onSnapshot, Query, setDoc } from '@firebase/firestore'
import { query, limit } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useForceUpdate = () => {
	const [forceUpdate, setForceUpdate] = useState(false)
	return () => {
		setForceUpdate(!forceUpdate)
	}
}

export const useSubDoc = <T>(
	doc: DocumentReference<DocumentData>,
	deps: React.DependencyList = []
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>, (data: T) => Promise<void>] => {
	const [docData, setDocData] = useState<T>()
	useEffect(() => onSnapshot(doc, (snapshot) => setDocData(snapshot.data() as T)), deps)
	return [docData, setDocData, (data: T) => setDoc(doc, data)]
}

export const useSubCollection = <T>(
	collection: Query<DocumentData> | CollectionReference<DocumentData>,
	deps: React.DependencyList = [],
	limitAmount?: number
): [T[], React.Dispatch<React.SetStateAction<T[]>>, number, () => void, React.Dispatch<React.SetStateAction<number>>] => {
	const [collectionData, setCollectionData] = useState<T[]>([])
	const [lim, setLim] = useState(limitAmount ?? 0)

	useEffect(
		() =>
			onSnapshot(!!limitAmount ? query(collection, limit(lim)) : collection, (snapshot) =>
				setCollectionData(snapshot.docs.map((doc) => doc.data() as T))
			),
		!!limitAmount ? [...deps, lim] : deps
	)
	return [collectionData, setCollectionData, lim, () => setLim((lim) => lim + (limitAmount ?? 0)), setLim]
}
