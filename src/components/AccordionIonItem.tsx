import { IonIcon, IonItem, IonLabel, IonTitle } from '@ionic/react'
import { chevronDownOutline, chevronForwardOutline } from 'ionicons/icons'
import React, { PropsWithChildren, useState } from 'react'

interface AccordionIonItemProps extends PropsWithChildren<{}> {
	header: string
	icon?: string
	initiallyOpen?: boolean
	className?: string
	label?: boolean
}

const AccordionIonItem: React.FC<AccordionIonItemProps> = ({
	header,
	icon,
	initiallyOpen,
	className,
	children,
	label,
}) => {
	const [showItem, setShowItem] = useState(initiallyOpen)

	return (
		<>
			<IonItem className={className} button onClick={() => setShowItem(!showItem)}>
				<IonIcon icon={showItem ? chevronDownOutline : chevronForwardOutline} />
				{label ? <IonLabel>{header}</IonLabel> : <IonTitle>{header}</IonTitle>}
				<IonIcon slot='end' icon={icon} />
			</IonItem>
			<div className={className}>{showItem ? children : <></>}</div>
		</>
	)
}

export default AccordionIonItem
