import './App.css';
import SidebarAlert from './reusable-components/SidebarAlert/SidebarAlert';
import TopRowCard from './reusable-components/top-row-card/TopRowCard';
import AllocationItem from './reusable-components/AllocationItem/AllocationItem';
import { AlertTriangle, Bell, TrendingUp, Users, Activity, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

const iconMap = {
  Activity,
  AlertTriangle,
  Bell,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
};

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard');

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (requestError) {
        console.error('Failed to load dashboard data:', requestError);
        setError('The dashboard data could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <main className="dashboard-status">Loading dashboard…</main>;
  }

  if (error) {
    return <main className="dashboard-status">{error}</main>;
  }

  const topCards = dashboardData?.topCards ?? [];
  const allocationData = dashboardData?.allocationData ?? [];
  const months = dashboardData?.months ?? [];
  const portfolioValues = dashboardData?.portfolioValues ?? [];
  const benchmarkValues = dashboardData?.benchmarkValues ?? [];
  const alerts = dashboardData?.alerts ?? [];

  const total = allocationData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // const total = allocationData.reduce((sum, item) => sum + item.value, 0);
  const chartWidth = 420;
  const chartHeight = 180;
  const padding = { top: 16, right: 16, bottom: 28, left: 30 };
  const yMax = 16;
  const stepX = (chartWidth - padding.left - padding.right) / (months.length - 1);

  const toX = (index) => padding.left + index * stepX;
  const toY = (value) => padding.top + ((yMax - value) / yMax) * (chartHeight - padding.top - padding.bottom);

  const createSmoothPath = (values) => {
    const points = values.map((value, index) => ({
      x: toX(index),
      y: toY(value),
    }));

    if (points.length < 2) {
      return '';
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i += 1) {
      const prev = points[Math.max(0, i - 1)];
      const current = points[i];
      const next = points[i + 1];
      const nextNext = points[Math.min(points.length - 1, i + 2)];

      const controlX1 = current.x + (next.x - prev.x) / 6;
      const controlY1 = current.y + (next.y - prev.y) / 6;
      const controlX2 = next.x - (nextNext.x - current.x) / 6;
      const controlY2 = next.y - (nextNext.y - current.y) / 6;

      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }

    return path;
  };

  const portfolioPath = createSmoothPath(portfolioValues);
  const benchmarkPath = benchmarkValues
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${toX(index)} ${toY(value)}`)
    .join(' ');

  const donutGradient = allocationData.reduce((acc, item, index) => {
    const start = index === 0 ? 0 : acc.cumulative;
    const end = start + (item.value / total) * 100;
    acc.parts.push(`${item.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`);
    acc.cumulative = end;
    return acc;
  }, { cumulative: 0, parts: [] }).parts.join(', ');

  return (
    <div className="App">
        <div className="dashboard-header">
          <div className="left-header">
            <p className="owl-text">OWL</p>
            <p className="header-text">Fund Intelligence</p>
          </div>  
          <div className="right-header">
            <button className="notification-button">
              <Bell size={20} color="#7f7f7f" />
              <span className="notification-dot"></span>
            </button>
            <div className="profile-icon">
              <p className="profile-initials">JD</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">

          <div className="main-content">
            <div className="top-row">
              {topCards.map((card) => {
                const Icon = iconMap[card.icon];
                const TrendIcon = iconMap[card.trendIcon];

                return (
                  <TopRowCard
                    key={card.label}
                    icon={Icon}
                    value={card.value}
                    label={card.label}
                    percentage={card.percentage}
                    percentageColor={card.percentageColor}
                    trendIcon={TrendIcon}
                  />
                );
              })}
            </div>
            <div className="bottom-row">
              <div className="performance-card">
                <div className='performance-header'>
                  <div className='performance-header-left'>
                    <p className='performance-title'>Portfolio Performance</p>
                    <p className='performance-subtitle'>Cumulative returns vs. benchmark</p>
                  </div>
                  <div className='performance-header-right'>
                    <div className='portfolio-legend'>
                      <div className='portfolio-legend-block'></div>
                      <p className='portfolio-legend-text'>Portfolio</p>
                    </div>
                    <div className='benchmark-legend'>
                      <div className='benchmark-legend-block'></div>
                      <p className='benchmark-legend-text'>Benchmark</p>
                    </div>
                  </div>
                </div>

                <div className="performance-chart-card">
                  <svg className="performance-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Portfolio performance line chart">
                    {[0, 4, 8, 12, 16].map((tick) => (
                      <g key={tick}>
                        <line x1={padding.left} x2={chartWidth - padding.right} y1={toY(tick)} y2={toY(tick)} className="chart-grid-line" />
                        <text x={6} y={toY(tick) + 4} className="chart-axis-label">{tick}%</text>
                      </g>
                    ))}

                    {months.map((month, index) => (
                      <line
                        key={`v-${month}`}
                        x1={toX(index)}
                        x2={toX(index)}
                        y1={padding.top}
                        y2={chartHeight - padding.bottom}
                        className="chart-month-line"
                      />
                    ))}

                    <path d={portfolioPath} className="portfolio-line" />
                    <path d={benchmarkPath} className="benchmark-line" />

                    {months.map((month, index) => (
                      <text key={month} x={toX(index)} y={chartHeight - 12} textAnchor="middle" className="chart-month-label">{month}</text>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="allocation-card">
                <div className="allocation-header"> 
                  <p className="allocation-title">Strategy Allocation</p>
                <p className="allocation-subtitle">Current portfolio breakdown</p>
                </div>
                

                <div className="allocation-donut-wrap">
                  <div
                    className="allocation-donut"
                    style={{ backgroundImage: `conic-gradient(${donutGradient})` }}
                    aria-label="Allocation donut chart"
                  >
                  </div>
                </div>

                <div className="allocation-item-container">
                  {allocationData.map((item) => (
                    <AllocationItem
                      key={item.label}
                      label={item.label}
                      percent={`${item.value}%`}
                      blockColor={item.color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar">
            <div className="sidebar-title-box">
              <p className="sidebar-title">Alerts</p>
              <button type="button" className="sidebar-title-link">
                Mark all as read
              </button>
            </div>
            <div className="sidebar-alert-container">
              {alerts.map((alert) => {
                const Icon = iconMap[alert.icon];

                return (
                  <SidebarAlert
                    icon={Icon}
                    iconColor={alert.iconColor}
                    title={alert.title}
                    description={alert.description}
                    time={alert.time}
                    />
                );
              })}
            </div>
          </div>

        </div>
    </div>
  );
}

export default App;
