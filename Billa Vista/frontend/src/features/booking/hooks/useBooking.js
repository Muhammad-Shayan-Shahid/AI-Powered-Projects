import { useDispatch, useSelector } from 'react-redux'
import {
  setDate,
  setTime,
  incrementGuests,
  decrementGuests,
  setSeating,
} from '@/features/booking/state/booking.slice'

export const availableTimes = [
  { label: '5:00 PM', disabled: false },
  { label: '5:30 PM', disabled: true },
  { label: '6:00 PM', disabled: false },
  { label: '6:30 PM', disabled: false },
  { label: '7:00 PM', disabled: true },
  { label: '7:30 PM', disabled: false },
  { label: '8:00 PM', disabled: false },
  { label: '8:30 PM', disabled: true },
  { label: '9:00 PM', disabled: false },
]

export const seatingOptions = [
  { label: 'Indoor', value: 'Indoor', description: 'Cozy & climate controlled' },
  { label: 'Outdoor', value: 'Outdoor', description: 'Open-air terrace' },
  { label: 'Private', value: 'Private', description: 'Exclusive booth' },
]

export function useBooking() {
  const dispatch = useDispatch()
  const booking = useSelector((state) => state.booking)

  return {
    ...booking,
    availableTimes,
    seatingOptions,
    setDate: (value) => dispatch(setDate(value)),
    setTime: (value) => dispatch(setTime(value)),
    incrementGuests: () => dispatch(incrementGuests()),
    decrementGuests: () => dispatch(decrementGuests()),
    setSeating: (value) => dispatch(setSeating(value)),
  }
}
