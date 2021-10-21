import { User } from 'firebase/auth'
import React from 'react'
import { UserDataModel } from './data/account/User'
import { RestaurantBagItemModel } from './data/restaurants/Restaurant'

export type AppContextType = {
	user?: User
	setUser: (user: User) => void
	userData?: UserDataModel
	setUserData: (userData: UserDataModel) => void
	userFavorites: RestaurantBagItemModel[]
	setUserFavorites: (userFavorites: RestaurantBagItemModel[]) => void
	userBag: RestaurantBagItemModel[]
	setUserBag: (userBag: RestaurantBagItemModel[]) => void
}

export const AppContext = React.createContext({
	user: undefined,
	setUser: (user: User) => {},
	userData: undefined,
	setUserData: (userData: UserDataModel) => {},
	userFavorites: [],
	setUserFavorites: (userFavorites: RestaurantBagItemModel[]) => {},
	userBag: [],
	setUserBag: (userBag: RestaurantBagItemModel[]) => {},
} as AppContextType)
