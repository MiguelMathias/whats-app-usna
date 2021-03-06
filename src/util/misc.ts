import { format } from 'date-fns'

export type MapStringType<V> = { [key: string]: V }

export const getAlpha = (midEmail: string) => midEmail.slice(1, 7)

export const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined)

export const distinct = (value: any, index: any, self: string | any[]) => value && self.indexOf(value) === index

export const encodeB64Url = <T>(objectToEncode: T) => encodeURI(btoa(JSON.stringify(objectToEncode)))
export const decodeB64Url = <T>(strToDecode: string) => JSON.parse(atob(decodeURI(strToDecode))) as T

export const formatDateDefault = (date: Date) => format(date, 'EEE, MMM d y H:mm')

export const chunkArray = <T>(arr: T[], chunkSize: number) => {
	const chunks = []
	for (let i = 0; i < arr.length; i += chunkSize) chunks.push(arr.slice(i, i + chunkSize))
	return chunks
}

export const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

declare global {
	interface Array<T> {
		remove(elem: T, item?: T): T | undefined
		removeIndex(index: number, item?: T): T[]
		indexOfValue(elem: T): number
	}
}

if (!Array.prototype.remove) {
	Array.prototype.remove = function <T>(this: T[], elem: T, item?: T): T | undefined {
		const index = this.indexOfValue(elem)
		if (index !== -1) return item ? this.splice(index, 1, item)[0] : this.splice(index, 1)[0]
		return undefined
	}
}

if (!Array.prototype.removeIndex)
	Array.prototype.removeIndex = function <T>(this: T[], index: number, item?: T): T[] {
		return this.slice(0, index).concat(this.slice(index + 1))
	}

if (!Array.prototype.indexOfValue)
	Array.prototype.indexOfValue = function <T>(this: T[], elem: T): number {
		let index = -1
		this.forEach((item, itemIndex) => (index = object_equals(item, elem) ? itemIndex : index))

		return index
	}

export const object_equals = (x: any, y: any): boolean => {
	if (x === y) return true
	// if both x and y are null or undefined and exactly the same

	if (!(x instanceof Object) || !(y instanceof Object)) return false
	// if they are not strictly equal, they both need to be Objects

	if (x.constructor !== y.constructor) return false
	// they must have the exact same prototype chain, the closest we can do is
	// test there constructor.

	for (var p in x) {
		if (!x.hasOwnProperty(p)) continue
		// other properties were tested using x.constructor === y.constructor

		if (!y.hasOwnProperty(p)) return false
		// allows to compare x[ p ] and y[ p ] when set to undefined

		if (x[p] === y[p]) continue
		// if they have the same strict value or identity then they are equal

		if (typeof x[p] !== 'object') return false
		// Numbers, Strings, Functions, Booleans must be strictly equal

		if (!object_equals(x[p], y[p])) return false
		// Objects and Arrays must be tested recursively
	}

	for (p in y) if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false
	// allows x[ p ] to be set to undefined

	return true
}
