import { useDispatch, useSelector } from 'react-redux'
import { setTableStatus, setReservationStatus } from '@/features/admin/state/admin.slice'
import { peakHours, topSellingItems, liveOrders } from '@/lib/data'

export function useAdmin() {
  const dispatch = useDispatch()
  const tables = useSelector((state) => state.admin.tables)
  const reservations = useSelector((state) => state.admin.reservations)
  const stats = useSelector((state) => state.admin.stats)

  return {
    tables,
    reservations,
    stats,
    peakHours,
    topSellingItems,
    liveOrders,
    updateTableStatus: (id, status, guestName) => dispatch(setTableStatus({ id, status, guestName })),
    updateReservationStatus: (id, status) => dispatch(setReservationStatus({ id, status })),
  }
}
