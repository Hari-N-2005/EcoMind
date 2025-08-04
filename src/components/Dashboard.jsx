import { useEffect, useState } from 'react'
import ActivityChart from './ActivityChart'
import DomainList from './DomainList'
import StatsCard from './StatsCard'
import useActivityData from '../hooks/useActivityData'

const Dashboard = () => {
  const { activityData, totalTime, isLoading } = useActivityData()
  const [chartType, setChartType] = useState('pie')

  if (isLoading) return <div className="loading">Loading data...</div>

  return (
    <div className="dashboard">
      <div className="stats-row">
        <StatsCard 
          title="Total Tracked Time" 
          value={`${Math.floor(totalTime / 60)}h ${totalTime % 60}m`} 
        />
        <StatsCard 
          title="Websites Tracked" 
          value={activityData.length} 
        />
      </div>
      
      <div className="chart-controls">
        <button 
          onClick={() => setChartType('pie')} 
          className={chartType === 'pie' ? 'active' : ''}
        >
          Pie Chart
        </button>
        <button 
          onClick={() => setChartType('bar')} 
          className={chartType === 'bar' ? 'active' : ''}
        >
          Bar Chart
        </button>
      </div>
      
      <ActivityChart data={activityData} chartType={chartType} />
      
      <DomainList data={activityData} />
    </div>
  )
}

export default Dashboard