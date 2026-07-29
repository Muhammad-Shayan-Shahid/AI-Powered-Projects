import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { toast } from 'sonner'
import AdminSidebar from '@/features/admin/components/AdminSidebar'
import { useAdmin } from '@/features/admin/hooks/useAdmin'
import { cn } from '@/lib/utils'

const statusOrder = ['available', 'reserved', 'occupied']

const statusStyles = {
  available: 'border-primary/60 bg-primary/10 text-primary',
  reserved: 'border-sky-400/60 bg-sky-400/10 text-sky-300',
  occupied: 'border-accent-orange/60 bg-accent-orange/10 text-accent-orange',
}

const legend = [
  { status: 'available', label: 'Available' },
  { status: 'reserved', label: 'Reserved' },
  { status: 'occupied', label: 'Occupied' },
]

export default function TableManagement() {
  const { tables, reservations, updateTableStatus } = useAdmin()

  const handleCycleStatus = (table) => {
    const currentIndex = statusOrder.indexOf(table.status)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
    updateTableStatus(table.id, nextStatus, nextStatus === 'available' ? null : table.guestName ?? 'Walk-in')
    toast.success(`Table ${table.number} marked ${nextStatus}`)
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-1 overflow-x-hidden p-5 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Live Floor</h1>
            <p className="text-sm text-muted">Tap a table to update its status.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {legend.map((item) => (
              <span key={item.status} className="flex items-center gap-2 text-xs text-muted">
                <span className={cn('h-2.5 w-2.5 rounded-full', statusStyles[item.status].split(' ')[0].replace('border', 'bg'))} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {tables.map((table, idx) => (
              <motion.button
                key={table.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (idx % 8) * 0.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCycleStatus(table)}
                className={cn(
                  'rounded-xl border p-4 text-left transition-colors min-h-[44px]',
                  statusStyles[table.status],
                )}
              >
                <p className="text-lg font-bold">T{table.number}</p>
                <p className="mt-1 flex items-center gap-1 text-xs opacity-80">
                  <Users className="h-3 w-3" /> {table.seats} seats
                </p>
                <p className="mt-2 truncate text-xs font-medium capitalize">{table.status}</p>
                {table.guestName && <p className="truncate text-[11px] opacity-70">{table.guestName}</p>}
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="h-fit rounded-2xl border border-border bg-surface p-5"
          >
            <h2 className="font-semibold">Upcoming Reservations</h2>
            <div className="mt-4 space-y-3">
              {reservations.map((res) => (
                <div key={res.id} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{res.name}</p>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
                        res.status === 'confirmed' && 'bg-primary/20 text-primary',
                        res.status === 'pending' && 'bg-accent-orange/20 text-accent-orange',
                        res.status === 'cancelled' && 'bg-red-500/20 text-red-400',
                      )}
                    >
                      {res.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {res.date} · {res.time} · {res.guests} guests
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
