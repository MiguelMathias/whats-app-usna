import React from 'react'
import { TradeCategoryModel, TradeOfferModel } from '../../data/trade/Trade'
import TradeOfferCard from './TradeOfferCard'
import './TradeOffersGrid.scss'

type TradeOffersGridProps = {
	isMine?: boolean
	tradeOffers: TradeOfferModel[]
	searchText?: string
	categories?: TradeCategoryModel[]
}

const TradeOffersGrid: React.FC<TradeOffersGridProps> = ({ isMine, tradeOffers, searchText, categories }) => {
	const shoudDisplay = (tradeOffer: TradeOfferModel) => {
		if (categories?.includes(tradeOffer.category) || !categories) {
			if (searchText?.length)
				return (
					tradeOffer.category.toLowerCase().startsWith(searchText.toLowerCase()) ||
					tradeOffer.title.toLowerCase().startsWith(searchText.toLowerCase()) ||
					tradeOffer.description.toLowerCase().includes(searchText.toLowerCase())
				)
			else return true
		}
		return false
	}
	return tradeOffers.length <= 0 ? (
		<div style={{ minHeight: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
			<p>No offers right now! Make one, or come back later.</p>
		</div>
	) : (
		<div className='row'>
			{tradeOffers.map((tradeOffer, i) => (
				<React.Fragment key={i}>
					{shoudDisplay(tradeOffer) && (
						<div className='col'>
							<TradeOfferCard isMine={isMine} tradeOffer={tradeOffer} />
						</div>
					)}
				</React.Fragment>
			))}
		</div>
	)
}

export default TradeOffersGrid
