import { useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { useAnalytics } from '../../hooks/useAnalytics'
import Loader from '../../components/common/Loader'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'

export default function AnalyticsDashboardPage() {
  const { chartData, distribution, isLoading, fetchDashboardData } = useAnalytics()

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-900 border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-dark-300 text-xs mb-1">{label}</p>
          <p className="text-brand-400 font-bold">{payload[0].value} messages</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Analytics & Reports</h1>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Line/Area Chart */}
                <div className="lg:col-span-2 glass p-6">
                  <h3 className="text-lg font-bold mb-6">Message Volume (Last 30 Days)</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5c6ef8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#5c6ef8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2e3286" vertical={false} />
                        <XAxis dataKey="date" stroke="#9696b4" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9696b4" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="count" stroke="#5c6ef8" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="glass p-6">
                  <h3 className="text-lg font-bold mb-6">Rating Distribution</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={distribution} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2e3286" vertical={false} />
                        <XAxis dataKey="rating" stroke="#9696b4" fontSize={12} tickLine={false} axisLine={false} 
                               tickFormatter={(val) => `${val} ★`} />
                        <YAxis stroke="#9696b4" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Ratings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

