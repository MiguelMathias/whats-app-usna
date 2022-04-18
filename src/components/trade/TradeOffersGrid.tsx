import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { TradeCategoryModel, TradeOfferModel } from '../../data/trade/Trade'
import TradeOfferCard from './TradeOfferCard'
import './TradeOffersGrid.scss'

type TradeOffersGridProps = {
	isMine?: boolean
	tradeOffers: TradeOfferModel[]
	searchText?: string
	categories?: TradeCategoryModel[]
}

type WindowSize = 'sm' | 'md' | 'lg'

const getSize = (): WindowSize => (window.innerWidth > 800 ? 'lg' : window.innerWidth > 600 ? 'md' : 'sm')
const getCols = (windowSize: WindowSize) => (windowSize === 'lg' ? 3 : windowSize === 'md' ? 2 : 1)

const getGridCols = (arr: any[], cols: number) => {
	function getEveryNth(arr: any[], nth: number, start: number = 0) {
		const result = []

		for (let i = start; i < arr.length; i += nth) {
			result.push(arr[i])
		}

		return result
	}
	const grid: any[][] = []
	for (let i = 0; i < cols; i++) {
		grid.push(getEveryNth(arr, cols, i))
	}

	return grid
}

const TradeOffersGrid: React.FC<TradeOffersGridProps> = ({ isMine, tradeOffers, searchText, categories }) => {
	const [windowSize, setWindowSize] = useState<WindowSize>(getSize())

	useEffectOnce(() => {
		const handleResize = () => setWindowSize(getSize())

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	})

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
		<div className='row' style={{ marginBottom: 10 }}>
			{getGridCols(tradeOffers, getCols(windowSize)).map((tradeOffers, i) => (
				<div key={i} className='col'>
					{tradeOffers.map((tradeOffer, j) => (
						<React.Fragment key={j}>{shoudDisplay(tradeOffer) && <TradeOfferCard isMine={isMine} tradeOffer={tradeOffer} />}</React.Fragment>
					))}
				</div>
			))}
		</div>
	)
}

export default TradeOffersGrid
