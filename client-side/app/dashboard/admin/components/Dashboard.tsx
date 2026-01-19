export default function Dashboard() {
  return (
    <section>
      <h2 className="text-2xl text-black font-bold mb-6">Dashboard</h2>

      {/* Simple Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="  text-black text-gray-500 text-sm">Total Users</p>
          <h3 className="text-3xl font-bold mt-2">120</h3>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Products</p>
          <h3 className="text-3xl font-bold mt-2">350</h3>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Active Orders</p>
          <h3 className="text-3xl font-bold mt-2">45</h3>
        </div>
      </div>
    </section>
  );
}
