import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonMenuButton,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToggle,
	IonToolbar,
	useIonModal,
} from '@ionic/react'
import { signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { checkmarkOutline, qrCodeOutline } from 'ionicons/icons'
import QRCode from 'qrcode'
import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../AppContext'
import { setUserDataDoc, UserDataModel } from '../../data/account/User'
import { auth, firestore } from '../../Firebase'
import { useForceUpdate, useSubDoc } from '../../util/hooks'
import { getAlpha, object_equals } from '../../util/misc'
import LoadingPage from '../LoadingPage'
import LogInPage from './LogInPage'

type ProfileQRModalProps = {
	hideQRModal: () => void
}

const ProfileQRModal: React.FC<ProfileQRModalProps> = ({ hideQRModal }) => {
	const { user, userData } = useContext(AppContext)
	const [qrCodeUrl, setQrCodeUrl] = useState('')

	useEffect(() => {
		if (user?.email) QRCode.toDataURL(JSON.stringify({ email: user.email, company: userData?.company }), { scale: 16 }).then((url) => setQrCodeUrl(url))
	}, [user?.email, userData?.company])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>{user?.displayName}</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => hideQRModal()}>Done</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				{qrCodeUrl && (
					<div style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
						<img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={qrCodeUrl} />
					</div>
				)}
			</IonContent>
		</IonPage>
	)
}

const ProfilePage: React.FC = () => {
	const { user, userData } = useContext(AppContext)
	const [localUserData, setLocalUserData] = useSubDoc<UserDataModel>(doc(firestore, 'users', user?.uid ?? ''), [user?.uid]) //useState(!!userData ? { ...userData } : undefined)
	const [showQRModal, hideQRModal] = useIonModal(<ProfileQRModal hideQRModal={() => hideQRModal()} />)
	const headerRef = useRef<HTMLIonHeaderElement | null>(null)

	if (!user) return <LogInPage />
	if (!localUserData) return <LoadingPage />

	return (
		<IonPage>
			<IonHeader ref={headerRef}>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Account</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => showQRModal({ swipeToClose: true, presentingElement: headerRef.current ?? undefined })}>
							<IonIcon slot='icon-only' icon={qrCodeOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<img src={user.photoURL ?? undefined} alt='Profile Picture' style={{ borderRadius: '50%' }} />
				</div>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<IonLabel>{user.displayName}</IonLabel>
				</div>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<IonButton onClick={() => signOut(auth)}>Log Out</IonButton>
				</div>
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<IonList>
						<IonItem>
							<IonLabel>Company</IonLabel>
							<IonSelect
								slot='end'
								value={localUserData.company}
								onIonChange={(e) => {
									setLocalUserData({ ...localUserData, company: e.detail.value ?? '' })
								}}
							>
								{[...Array(30).keys()].map((i) => (
									<IonSelectOption key={i} value={i + 1}>
										{i + 1}
									</IonSelectOption>
								))}
							</IonSelect>
						</IonItem>
						<IonItem>
							<IonLabel position='stacked'>Room Number</IonLabel>
							<IonInput
								type='number'
								inputMode='numeric'
								value={localUserData.roomNumber}
								onIonChange={(e) => setLocalUserData({ ...localUserData, roomNumber: e.detail.value ?? '' })}
							/>
						</IonItem>
						<IonItem>
							<IonLabel position='stacked'>Phone Number</IonLabel>
							<IonInput
								type='tel'
								inputMode='tel'
								value={localUserData.phoneNumber}
								onIonChange={(e) => setLocalUserData({ ...localUserData, phoneNumber: e.detail.value ?? '' })}
							/>
						</IonItem>
						<IonItem>
							<IonLabel position='stacked'>Venmo ID</IonLabel>
							<IonInput
								type='text'
								inputMode='text'
								value={localUserData.venmoId?.startsWith('@') ? localUserData.venmoId : `@${localUserData.venmoId ?? ''}`}
								onIonChange={(e) => setLocalUserData({ ...localUserData, venmoId: e.detail.value ?? '' })}
							/>
						</IonItem>
						<IonItem>
							<IonLabel>Account Update Notifications</IonLabel>
							<IonToggle
								checked={localUserData.subbedTopics?.includes('mids')}
								onIonChange={(e) => {
									setLocalUserData({
										...localUserData,
										subbedTopics: e.detail.checked
											? (localUserData.subbedTopics ?? []).concat('mids')
											: (localUserData.subbedTopics ?? []).filter((topic) => topic !== 'mids'),
									})
								}}
							/>
						</IonItem>
						<IonItem>
							<IonLabel>MFSD Update Notifications</IonLabel>
							<IonToggle
								checked={localUserData.subbedTopics?.includes('mfsd')}
								onIonChange={(e) => {
									setLocalUserData({
										...localUserData,
										subbedTopics: e.detail.checked
											? (localUserData.subbedTopics ?? []).concat('mfsd')
											: (localUserData.subbedTopics ?? []).filter((topic) => topic !== 'mfsd'),
									})
								}}
							/>
						</IonItem>
						<IonItem>
							<IonLabel>MWF Update Notifications</IonLabel>
							<IonToggle
								checked={localUserData.subbedTopics?.includes('mwf')}
								onIonChange={(e) => {
									setLocalUserData({
										...localUserData,
										subbedTopics: e.detail.checked
											? (localUserData.subbedTopics ?? []).concat('mwf')
											: (localUserData.subbedTopics ?? []).filter((topic) => topic !== 'mwf'),
									})
								}}
							/>
						</IonItem>
						<IonItem>
							<IonLabel>NABSD Update Notifications</IonLabel>
							<IonToggle
								checked={localUserData.subbedTopics?.includes('nabsd')}
								onIonChange={(e) => {
									setLocalUserData({
										...localUserData,
										subbedTopics: e.detail.checked
											? (localUserData.subbedTopics ?? []).concat('nabsd')
											: (localUserData.subbedTopics ?? []).filter((topic) => topic !== 'nabsd'),
									})
								}}
							/>
						</IonItem>
						<IonItem>
							<IonLabel>MidBay Notifications</IonLabel>
							<IonToggle
								checked={localUserData.subbedTopics?.includes('trade')}
								onIonChange={(e) => {
									setLocalUserData({
										...localUserData,
										subbedTopics: e.detail.checked
											? (localUserData.subbedTopics ?? []).concat('trade')
											: (localUserData.subbedTopics ?? []).filter((topic) => topic !== 'trade'),
									})
								}}
							/>
						</IonItem>
					</IonList>
				</div>
				<div style={{ textAlign: 'center', margin: 20 }}>
					<IonButton onClick={() => setUserDataDoc(user, localUserData)} disabled={object_equals(localUserData, userData)}>
						Save Changes
					</IonButton>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default ProfilePage
