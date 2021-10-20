import { useState } from 'react'

export const useForceUpdate = () => {
	const [forceUpdate, setForceUpdate] = useState(false)
	return () => {
		setForceUpdate(!forceUpdate)
	}
}
