import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import LogIn from './LogIn'
import UserHomeTabs from './UserHomeTabs'

const Account: React.FC = () => {
	const { user } = useContext(AppContext)
	return user ? <UserHomeTabs /> : <LogIn />
}

export default Account
