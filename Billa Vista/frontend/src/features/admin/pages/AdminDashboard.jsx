import { motion } from 'framer-motion'
import { ClipboardList, TrendingUp, Users, Sparkles, Search, Bell } from 'lucide-react'
import AdminSidebar from '@/features/admin/components/AdminSidebar'
import { useAdmin } from '@/features/admin/hooks/useAdmin'
import { cn, formatCurrency } from '@/lib/utils'

const statusStyles = {
  Preparing: 'bg-accent-orange/20 text-accent-orange',
  Ready: 'bg-primary/20 text-primary',
  Delivered: 'bg-muted/20 text-muted',
}

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function AdminDashboard() {
  const { stats, peakHours, topSellingItems, liveOrders } = useAdmin()

  const statCards = [
    {
      label: "Today's Orders",
      value: stats.todayOrders,
      note: stats.todayOrdersChange,
      icon: ClipboardList,
      color: 'text-primary bg-primary/15',
    },
    {
      label: 'Revenue',
      value: `${stats.currency}${stats.revenue.toLocaleString()}`,
      note: stats.revenueChange,
      icon: TrendingUp,
      color: 'text-accent-orange bg-accent-orange/15',
    },
    {
      label: 'Active Tables',
      value: `${stats.activeTables}/${stats.totalTables}`,
      note: `${stats.totalTables - stats.activeTables} tables free`,
      icon: Users,
      color: 'text-sky-400 bg-sky-400/15',
    },
    {
      label: 'AI Queries Handled',
      value: stats.aiQueries,
      note: stats.aiQueriesNote,
      icon: Sparkles,
      color: 'text-violet-400 bg-violet-400/15',
    },
  ]

  const maxPeak = Math.max(...peakHours.map((p) => p.value))

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-1 overflow-x-hidden p-5 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good Evening, Manager</h1>
            <p className="text-sm text-muted">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
              <Search className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', card.color)}>
                <card.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm text-muted">{card.label}</p>
              <p className="mt-1 text-2xl font-bold">{card.value}</p>
              <p className="mt-1 text-xs text-muted">{card.note}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Live Orders</h2>
              <span className="flex items-center gap-1 text-xs text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Updating live
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {liveOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <img src={order.image} alt={order.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {order.name} <span className="text-xs font-normal text-muted">#{order.id}</span>
                    </p>
                    <p className="text-xs text-muted">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{formatCurrency(order.total)}</p>
                    <span
                      className={cn(
                        'mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                        statusStyles[order.status],
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <h2 className="font-semibold">AI Insights</h2>
              <p className="text-xs text-muted">Peak hours today — busiest around 8PM</p>
              <div className="mt-5 flex items-end gap-2">
                {peakHours.map((hour) => (
                  <div key={hour.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(hour.value / maxPeak) * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full rounded-t-md bg-primary"
                        style={{ minHeight: 4 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted">{hour.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <h2 className="font-semibold">Top Selling Items</h2>
              <div className="mt-4 space-y-4">
                {topSellingItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="w-4 text-sm font-semibold text-muted">{idx + 1}</span>
                    <img src={item.image} alt={item.name} className="h-9 w-9 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.sold / topSellingItems[0].sold) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-accent-orange">{item.sold} sold</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
