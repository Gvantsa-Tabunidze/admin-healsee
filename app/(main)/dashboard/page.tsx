import Link from "next/link";

export default function DashboardPage() {
  return <section className="page-section empty-dashboard"><div className="empty-icon">✦</div><h1>Your dashboard is ready</h1><p>Useful shop metrics and activity will live here. Start by adding your first product.</p><Link className="primary-button" href="/products/new">＋ Add product</Link></section>;
}
