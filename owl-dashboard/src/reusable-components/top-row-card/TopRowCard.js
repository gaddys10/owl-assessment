import './TopRowCard.css';

function TopRowCard({
    icon: Icon,
    value,
    label,
    percentage,
    percentageColor = '#22c55e',
    trendIcon: TrendIcon,
}) {
    return (
        <div className="top-row-card">
            
            <div className="card-top-row">
                <div
                    className="card-icon"
                    style={{ backgroundColor: "#e0e0e0", color: "#7f7f7f" }}
                >
                    {Icon ? <Icon size={20} color="#7f7f7f" /> : null}
                </div>

                { percentage ? (
                    <div className="percentage-box">
                        {TrendIcon ? <TrendIcon size={14} color={percentageColor} /> : null}
                        <p className="percentage" style={{ color: percentageColor }}>
                            {percentage}
                        </p>
                    </div>
                ) : null }
            </div>

            <p className="card-value">{value}</p>
            <p className="card-label">{label}</p>
        </div>
    );
}

export default TopRowCard;
