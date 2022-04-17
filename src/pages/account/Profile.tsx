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
import { useForceUpdate } from '../../util/hooks'
import { getAlpha } from '../../util/misc'
import LoadingPage from '../LoadingPage'

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
			<IonContent fullscreen>
				{qrCodeUrl && (
					<div style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
						<img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={qrCodeUrl} />
					</div>
				)}
			</IonContent>
		</IonPage>
	)
}

const Profile: React.FC = () => {
	const { user, userData, setUserData } = useContext(AppContext)
	const [roomNo, setRoomNo] = useState<string>()
	const [phoneNo, setPhoneNo] = useState<string>()
	const [venmoId, setVenmoId] = useState<string>()
	const [showQRModal, hideQRModal] = useIonModal(<ProfileQRModal hideQRModal={() => hideQRModal()} />)
	const contentRef = useRef<HTMLIonContentElement | null>(null)

	useEffect(() => {
		if (user)
			return onSnapshot(doc(firestore, 'users', user.uid), (snapshot) => {
				const newUserData = snapshot.data() as UserDataModel
				setUserData(newUserData)
				setRoomNo(newUserData.roomNumber)
				setPhoneNo(newUserData.phoneNumber)
				setVenmoId(newUserData.venmoId)
			})
	}, [user?.uid])

	if (!user || !userData) return <LoadingPage />

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Account</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => showQRModal({ swipeToClose: true, presentingElement: contentRef.current ?? undefined })}>
							<IonIcon slot='icon-only' icon={qrCodeOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen ref={contentRef}>
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
								value={userData.company}
								onIonChange={(e) => {
									if (!userData.company) return
									setUserDataDoc(user, { ...userData, company: e.detail.value ?? '' })
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
							<IonInput type='number' inputMode='numeric' value={roomNo} onIonChange={(e) => setRoomNo(e.detail.value ?? '')} />
							<IonButtons slot='end'>
								<IonButton
									disabled={roomNo === userData.roomNumber || !roomNo?.length}
									onClick={() => setUserDataDoc(user, { ...userData, roomNumber: roomNo })}
								>
									<IonIcon slot='icon-only' icon={checkmarkOutline} />
								</IonButton>
							</IonButtons>
						</IonItem>
						<IonItem>
							<IonLabel position='stacked'>Phone Number</IonLabel>
							<IonInput type='tel' inputMode='tel' value={phoneNo} onIonChange={(e) => setPhoneNo(e.detail.value ?? '')} />
							<IonButtons slot='end'>
								<IonButton
									disabled={phoneNo === userData.phoneNumber || !phoneNo?.length}
									onClick={() => setUserDataDoc(user, { ...userData, phoneNumber: phoneNo })}
								>
									<IonIcon slot='icon-only' icon={checkmarkOutline} />
								</IonButton>
							</IonButtons>
						</IonItem>
						<IonItem>
							<IonLabel position='stacked'>Venmo ID</IonLabel>
							<IonInput
								type='text'
								inputMode='text'
								value={venmoId?.startsWith('@') ? venmoId : `@${venmoId ?? ''}`}
								onIonChange={(e) => setVenmoId(e.detail.value ?? '')}
							/>
							<IonButtons slot='end'>
								<IonButton
									disabled={venmoId?.replaceAll('@', '') === userData.venmoId?.replaceAll('@', '') || !venmoId?.length}
									onClick={() => setUserDataDoc(user, { ...userData, venmoId: venmoId?.startsWith('@') ? venmoId.slice(1) : venmoId })}
								>
									<IonIcon slot='icon-only' icon={checkmarkOutline} />
								</IonButton>
							</IonButtons>
						</IonItem>
						<IonItem>
							<IonLabel>Account Update Notifications</IonLabel>
							<IonToggle
								checked={userData.subbedTopics?.includes('mids')}
								onIonChange={(e) => {
									if (!userData.subbedTopics) return
									setUserDataDoc(user, {
										...userData,
										subbedTopics: e.detail.checked
											? userData.subbedTopics.concat('mids')
											: userData.subbedTopics.filter((topic) => topic !== 'mids'),
									})
								}}
							/>
						</IonItem>
						<IonItem>
							<IonLabel>MFSD Update Notifications</IonLabel>
							<IonToggle
								checked={userData.subbedTopics?.includes('mfsd')}
								onIonChange={(e) => {
									if (!userData.subbedTopics) return
									setUserDataDoc(user, {
										...userData,
										subbedTopics: e.detail.checked
											? userData.subbedTopics?.concat('mfsd')
											: userData.subbedTopics?.filter((topic) => topic !== 'mfsd'),
									})
								}}
							/>
						</IonItem>
						<IonItem>
							<IonLabel>MWF Update Notifications</IonLabel>
							<IonToggle
								checked={userData.subbedTopics?.includes('mwf')}
								onIonChange={(e) => {
									if (!userData.subbedTopics) return
									setUserDataDoc(user, {
										...userData,
										subbedTopics: e.detail.checked
											? userData.subbedTopics?.concat('mwf')
											: userData.subbedTopics?.filter((topic) => topic !== 'mwf'),
									})
								}}
							/>
						</IonItem>
						<IonItem>
							<IonLabel>NABSD Update Notifications</IonLabel>
							<IonToggle
								checked={userData.subbedTopics?.includes('nabsd')}
								onIonChange={(e) => {
									if (!userData.subbedTopics) return
									setUserDataDoc(user, {
										...userData,
										subbedTopics: e.detail.checked
											? userData.subbedTopics?.concat('nabsd')
											: userData.subbedTopics?.filter((topic) => topic !== 'nabsd'),
									})
								}}
							/>
						</IonItem>
					</IonList>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default Profile
