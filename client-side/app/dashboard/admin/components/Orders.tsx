export default function Orders() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-(--bg-secondary) p-4 rounded-lg">Total: 240</div>
        <div className="bg-(--bg-secondary) p-4 rounded-lg">Completed: 200</div>
        <div className="bg-(--bg-secondary) p-4 rounded-lg">Pending: 30</div>
        <div className="bg-(--bg-secondary) p-4 rounded-lg">Cancelled: 10</div>
      </div>

      {/* Orders Table */}
      <div className="bg-(--bg-secondary) p-4 rounded-lg">
        <p>Orders table will appear here...</p>
      </div>
    </div>
  );
}
