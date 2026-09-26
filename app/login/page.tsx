import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <div className="brand login-brand">
          <span className="brand-mark">h</span>
          <span>healsee</span>
        </div>
        <p className="eyebrow">Admin workspace</p>
        <h1>Welcome back</h1>
        <p className="subheading">
          Your session has ended. Sign in to continue managing your shop.
        </p>
        <form className="login-form">
          <label className="field">
            <span>Email address</span>
            <input required type="email" placeholder="you@example.com" />
          </label>
          <label className="field">
            <span>Password</span>
            <input required type="password" placeholder="Enter your password" />
          </label>
          <button className="primary-button" type="submit">
            Sign in
          </button>
        </form>
        <Link className="login-back" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
