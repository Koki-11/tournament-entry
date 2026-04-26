import Link from "next/link";

export default function CancelPage() {
  return (
    <main>
      <section className="card grid">
        <h1>決済がキャンセルされました</h1>
        <p className="muted">エントリーはまだ完了していません。必要に応じて再度お申し込みください。</p>
        <Link className="button" href="/">エントリーに戻る</Link>
      </section>
    </main>
  );
}
