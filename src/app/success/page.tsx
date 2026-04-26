import Link from "next/link";

export default function SuccessPage() {
  return (
    <main>
      <section className="card grid">
        <h1>エントリーが完了しました</h1>
        <p className="muted">決済が確認され、エントリー情報が自動登録されました。確認メールはStripeから送信されます。</p>
        <Link className="button" href="/">トップへ戻る</Link>
      </section>
    </main>
  );
}
