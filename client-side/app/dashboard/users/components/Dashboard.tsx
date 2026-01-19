export default function Dashboard() {
  const role=localStorage.getItem("role")
  return <section className="text-black"> {role} dashboard</section>;
}
