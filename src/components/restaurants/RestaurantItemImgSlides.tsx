import { getDownloadURL, listAll, ref } from '@firebase/storage'
import { useEffect, useState } from 'react'
import { RestaurantItemModel } from '../../data/restaurants/Restaurant'
import { storage } from '../../Firebase'
import ImgSlides from '../ImgSlides'

type RestaurantItemImgSlidesProps = {
	restaurantItem: RestaurantItemModel
	maxImgHeight?: number
}

const RestaurantItemImgSlides: React.FC<RestaurantItemImgSlidesProps> = ({ restaurantItem, maxImgHeight }) => {
	const [picSrcs, setPicSrcs] = useState<string[]>([])
	useEffect(() => {
		listAll(ref(storage, `/restaurants/${restaurantItem.restaurantUid}/items/${restaurantItem.uid}/pictures`)).then(async ({ items }) =>
			setPicSrcs(await Promise.all(items.map((item) => getDownloadURL(item))))
		)
	}, [restaurantItem.uid])
	return <ImgSlides picSrcs={picSrcs} maxImgHeight={maxImgHeight} />
}

export default RestaurantItemImgSlides
