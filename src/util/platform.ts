import { getPlatforms, setupConfig } from '@ionic/react'

export const isMobile = getPlatforms().includes('mobile')

export const isDesktop = getPlatforms().includes('desktop') || getPlatforms().includes('electron')

export const isIos = getPlatforms().includes('ios')

setupConfig({
	animated: true,
	hardwareBackButton: true,
	swipeBackEnabled: false,
})
