import './AllocationItem.css';

function AllocationItem({ label, percent, blockColor = '#3b82f6' }) {
  return (
    <div className="allocation-item">
      <div className="allocation-item-left">
        <div
          className="allocation-item-block"
          style={{ backgroundColor: blockColor }}
        />
        <p className="allocation-item-text">{label}</p>
      </div>
      <p className="allocation-item-percent">{percent}</p>
    </div>
  );
}

export default AllocationItem;
