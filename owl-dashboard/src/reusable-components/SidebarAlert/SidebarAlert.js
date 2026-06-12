import './SidebarAlert.css';

function SidebarAlert({
    icon: Icon,
    title,
    description,
    time,
    iconColor = '#22c55e',
    iconBackground = '#f3f4f6',
}) {
    return (
        <article className="sidebar-alert">
            <div
                className="sidebar-alert-icon"
                style={{ color: iconColor, backgroundColor: iconBackground }}
            >
                {Icon ? <Icon size={14} color={iconColor} /> : null}
            </div>

            <div className="sidebar-alert-content">
                <p className="sidebar-alert-title">{title}</p>
                <p className="sidebar-alert-description">{description}</p>
                <p className="sidebar-alert-time">{time}</p>
            </div>
        </article>
    );
}

export default SidebarAlert;
