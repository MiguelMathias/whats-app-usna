import { IonItemDivider, IonLabel } from '@ionic/react'
import React from 'react'
import { allCategories, RestaurantBagItemModel, RestaurantModel } from '../../data/restaurants/Restaurant'
import { capitalize } from '../../util/misc'
import RestaurantItemCard from './RestaurantItemCard'

type RestaurantMenuProps = {
	restaurant: RestaurantModel
	restaurantBagItems: RestaurantBagItemModel[]
	isOrder?: boolean
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ restaurant, restaurantBagItems, isOrder }) => (
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
							<div key={i}>
								{restaurantBagItemPair.map((restaurantBagItem, j) => (
									<RestaurantItemCard
										key={j}
										restaurant={restaurant}
										restaurantBagItem={restaurantBagItem}
										isOrder={isOrder}
									/>
								))}
							</div>
						))}
				</div>
			</React.Fragment>
		))}
	</>
)

export default RestaurantMenu
