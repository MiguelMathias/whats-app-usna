import { IonItemDivider, IonLabel } from '@ionic/react'
import React from 'react'
import { allCategories, RestaurantBagItemModel } from '../../data/restaurants/Restaurant'
import { capitalize } from '../../util/misc'
import RestaurantItemCard from './RestaurantItemCard'

type RestaurantMenuProps = {
	restaurantBagItems: RestaurantBagItemModel[]
	userFavoriteItems: RestaurantBagItemModel[]
	isOrder?: boolean
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ restaurantBagItems, userFavoriteItems, isOrder }) => (
	<>
		{allCategories(restaurantBagItems)?.map((category, i) => (
			<React.Fragment key={i}>
				<IonItemDivider sticky>
					<IonLabel color='dark'>{capitalize(category)}</IonLabel>
				</IonItemDivider>
				<div
					style={{
						display: 'flex',
						flexWrap: 'nowrap',
						overflowX: 'scroll',
					}}
				>
					{restaurantBagItems
						?.filter((restaurantBagItem) => restaurantBagItem.restaurantItem.category === category)
						.reduce((all, one, i) => {
							const ch = Math.floor(i / 2)
							all[ch] = ([] as RestaurantBagItemModel[]).concat(all[ch] || [], one)
							return all
						}, [] as RestaurantBagItemModel[][])
						.map((restaurantBagItemPair, i) => (
							<React.Fragment key={i}>
								{restaurantBagItemPair.map((restaurantBagItem, j) => (
									<RestaurantItemCard key={j} restaurantBagItem={restaurantBagItem} userFavoriteItems={userFavoriteItems} isOrder={isOrder} />
								))}
							</React.Fragment>
						))}
				</div>
			</React.Fragment>
		))}
	</>
)

export default RestaurantMenu
