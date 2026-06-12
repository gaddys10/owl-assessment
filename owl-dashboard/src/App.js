import './App.css';
import SidebarAlert from './reusable-components/SidebarAlert/SidebarAlert';
import TopRowCard from './reusable-components/top-row-card/TopRowCard';
import AllocationItem from './reusable-components/AllocationItem/AllocationItem';
import { AlertTriangle, Bell, TrendingUp, Users, Activity, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

const allocationData = [
  { label: 'Hedge Funds', value: 32, color: '#4625eb' },
  { label: 'Private Equity', value: 25, color: '#628ce7' },
  { label: 'Venture Capital', value: 18, color: '#14ac25' },
  { label: 'Real Assets', value: 12, color: '#eb7b25' },
  { label: 'Fixed Income', value: 8, color: '#eb2525' },
  { label: 'Public Equity', value: 5, color: '#c04cd7' },
];

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const portfolioValues = [2, 3.9, 1.5, 5, 4, 6, 8, 7, 9, 11, 10, 12.3];
const benchmarkValues = [2, 2.5, 3, 3.6, 4.2, 4.9, 5.5, 6.1, 6.7, 7.2, 7.6, 8];

function App() {
  const total = allocationData.reduce((sum, item) => sum + item.value, 0);
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
              <TopRowCard
                icon={Activity}
                value="142"
                label="Funds Monitored"
                percentage="8.2%"
                percentageColor="#22c55e"
                trendIcon={ArrowUpRight}
              />
              <TopRowCard
                icon={DollarSign}
                value="$15.0B"
                label="Total AUM Tracked"
                percentage="12.5%"
                percentageColor="#22c55e"
                trendIcon={ArrowUpRight}
              />
              <TopRowCard
                icon={TrendingUp}
                value="+12.5%"
                label="Average YTD Return"
                percentage="8.2%"
                percentageColor="#22c55e"
                trendIcon={ArrowUpRight}
              />
              <TopRowCard
                icon={AlertTriangle}
                value="24"
                label="Active Alerts"
                percentage="-15%"
                percentageColor="#c52222"
                trendIcon={ArrowDownRight}
              />
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
              <SidebarAlert
                icon={TrendingUp}
                iconColor="#616161"
                title="Tiger Global +25% YTD"
                description="Outperforming benchmark by 17.3pp"
                time="2h ago"
              />
              <SidebarAlert
                icon={AlertTriangle}
                iconColor="#f59e0b"
                title="Bridgewater drawdown alert"
                description="Pure alpha fund down -3.1% YTD"
                time="5h ago"
              />
              <SidebarAlert
                icon={Users}
                iconColor="#3b82f6"
                title="PM departure at Citizel"
                description="Senior PM Alex Chen leaving"
                time="6h ago"
              />
              <SidebarAlert
                icon={Activity}
                iconColor="#616161"
                title="Baupost ADV amendment"
                description="Updated Form ADV filed with SEC"
                time="1d ago"
              />
              <SidebarAlert
                icon={TrendingUp}
                iconColor="#616161"
                title="Renaissance +32.1%"
                description="Top performer in universe"
                time="1d ago"
              />
            </div>
          </div>

        </div>
    </div>
  );
}

export default App;
