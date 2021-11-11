import { getDownloadURL, listAll, ref } from '@firebase/storage'
import { useEffect, useState } from 'react'
import { RestaurantItemModel } from '../../data/restaurants/Restaurant'
import { storage } from '../../Firebase'
import ImgOrVidSlides from '../ImgOrVidSlides'

type RestaurantItemImgSlidesProps = {
	restaurantItem: RestaurantItemModel
	maxImgHeight?: number
}

const RestaurantItemImgSlides: React.FC<RestaurantItemImgSlidesProps> = ({ restaurantItem, maxImgHeight }) => {
	const [srcs, setSrcs] = useState<string[]>([])
	useEffect(() => {
		listAll(ref(storage, `/restaurants/${restaurantItem.restaurantUid}/items/${restaurantItem.uid}/media`)).then(async ({ items }) =>
			setSrcs(await Promise.all(items.map(async (item) => getDownloadURL(item))))
		)
	}, [restaurantItem.uid])
	return <ImgOrVidSlides slideSrcs={srcs} maxImgHeight={maxImgHeight} />
}

export default RestaurantItemImgSlides
