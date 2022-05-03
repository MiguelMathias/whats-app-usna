import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import LogInPage from './LogInPage'
import UserHomeTabs from './UserHomeTabs'

const AccountPage: React.FC = () => {
	const { user } = useContext(AppContext)
	return user ? <UserHomeTabs /> : <LogInPage />
}

export default AccountPage
