import { tournament } from "@/lib/tournament";

export default function EntryPage() {
  return (
    <main>
      <section className="card grid">
        <p className="muted">{tournament.dateLabel}</p>
        <h1>{tournament.name} エントリー</h1>
        <p className="muted">必要事項を入力後、Stripeの安全な決済画面へ進みます。決済完了後にエントリーが自動登録されます。</p>

        <form action="/api/checkout" method="POST" className="grid">
          <label>
            氏名
            <input name="playerName" required placeholder="例：杉本 洸紀" />
          </label>
          <label>
            メールアドレス
            <input name="email" required type="email" placeholder="example@email.com" />
          </label>
          <label>
            電話番号
            <input name="phone" required inputMode="tel" placeholder="090-xxxx-xxxx" />
          </label>
          <label>
            カテゴリ
            <select name="categoryId" required defaultValue="">
              <option value="" disabled>選択してください</option>
              {tournament.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} / ¥{category.price.toLocaleString()} / 定員{category.capacity}
                </option>
              ))}
            </select>
          </label>
          <label>
            ペア名（ダブルスの場合）
            <input name="partnerName" placeholder="例：山田 太郎" />
          </label>
          <label>
            所属・チーム名（任意）
            <input name="teamName" placeholder="例：Tokyo Pickleball Club" />
          </label>
          <button type="submit">決済へ進む</button>
        </form>
      </section>
    </main>
  );
}
