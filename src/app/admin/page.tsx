import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  if (!process.env.ADMIN_TOKEN || params.token !== process.env.ADMIN_TOKEN) {
    return (
      <main><section className="card"><h1>管理画面</h1><p className="error">URLに正しいtokenが必要です。</p></section></main>
    );
  }

  const { data, error } = await supabaseAdmin
    .from("registrations")
    .select("created_at,category_name,player_name,email,phone,partner_name,team_name,payment_status,amount_total")
    .order("created_at", { ascending: false });

  const count = data?.length ?? 0;
  const total = data?.reduce((sum, row) => sum + Number(row.amount_total ?? 0), 0) ?? 0;

  return (
    <main className="grid">
      <section className="card grid">
        <h1>管理画面</h1>
        <p>エントリー数：{count} / 入金合計：¥{total.toLocaleString()}</p>
        <a className="button" href={`/api/admin/export?token=${params.token}`}>CSVダウンロード</a>
        {error && <p className="error">{error.message}</p>}
      </section>
      <table>
        <thead><tr><th>日時</th><th>カテゴリ</th><th>氏名</th><th>メール</th><th>電話</th><th>ペア</th><th>所属</th><th>状態</th></tr></thead>
        <tbody>
          {(data ?? []).map((row, index) => (
            <tr key={index}>
              <td>{new Date(row.created_at).toLocaleString("ja-JP")}</td>
              <td>{row.category_name}</td>
              <td>{row.player_name}</td>
              <td>{row.email}</td>
              <td>{row.phone}</td>
              <td>{row.partner_name}</td>
              <td>{row.team_name}</td>
              <td>{row.payment_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
