import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import LogIn from './LogIn'
import UserHome from './UserHome'

const Account: React.FC = () => {
	const { user } = useContext(AppContext)
	return user ? <UserHome /> : <LogIn />
}

export default Account
