// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import { type Account, createAccount, deposit, listAccounts, transfer, withdraw } from "./api";
import { type AccountDetailsResponse, getAccountDetails } from "./api";
import { createPalette, createStyles, type Theme } from "./App.styles";

function parseAmount(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) throw new Error("Amount must be a positive number");
  return n;
}

type Panel = "none" | "depositWithdraw" | "transfer" | "details";

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // theme (dark / light) + persistence
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("frb_theme");
    return saved === "light" || saved === "dark" ? (saved as Theme) : "dark";
  });

  useEffect(() => {
    localStorage.setItem("frb_theme", theme);
  }, [theme]);

  // which panel is visible
  const [activePanel, setActivePanel] = useState<Panel>("none");

  // deposit/withdraw
  const [selectedId, setSelectedId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  // transfer
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");

  // details
  const [detailsAccountId, setDetailsAccountId] = useState<string>("");
  const [details, setDetails] = useState<AccountDetailsResponse | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const ids = useMemo(() => accounts.map((a) => a.id), [accounts]);

  const palette = createPalette(theme);
  const styles = createStyles(palette, theme);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await listAccounts();
      setAccounts(data);

      // set sensible defaults
      if (data[0]?.id) {
        setSelectedId((prev) => prev || data[0].id);
        setFromId((prev) => prev || data[0].id);
        setDetailsAccountId((prev) => prev || data[0].id);
      }
      if (data[1]?.id) {
        setToId((prev) => prev || data[1].id);
      }
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []); // run once on first render

  async function onCreate() {
    setLoading(true);
    setError("");
    try {
      await createAccount();
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onDeposit() {
    setLoading(true);
    setError("");
    try {
      const amt = parseAmount(amount);
      await deposit(selectedId, amt);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onWithdraw() {
    setLoading(true);
    setError("");
    try {
      const amt = parseAmount(amount);
      await withdraw(selectedId, amt);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onTransfer() {
    setLoading(true);
    setError("");
    try {
      const amt = parseAmount(transferAmount);
      await transfer(fromId, toId, amt);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function loadDetails(id: string) {
    if (!id) return;
    setDetailsLoading(true);
    setError("");
    try {
      const d = await getAccountDetails(id);
      setDetails(d);
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  }

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <div style={styles.page}>
      {/* Top-right toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        style={styles.toggleButton}
        aria-pressed={theme === "dark"}
        title="Toggle theme"
      >
        <span style={{ fontSize: 13, opacity: 0.9 }}>
          {theme === "dark" ? "Dark" : "Light"}
        </span>
        <span style={styles.toggleTrack} aria-hidden="true">
          <span style={styles.toggleThumb} />
        </span>
      </button>

      <div style={styles.headerTopSpace}>
        <h1 style={{ marginBottom: 6 }}>Fast & Reckless Bank 🏦</h1>
        <div style={{ opacity: 1, color: palette.mutedText, marginBottom: 16 }}>
          Backend :8080 • Frontend :5173
        </div>
      </div>

      {/* TOP TOOLBAR */}
      <div style={{ ...styles.row, marginBottom: 12 }}>
        <button style={styles.btn} onClick={onCreate} disabled={loading}>
          Create account
        </button>

        <button style={styles.btn} onClick={refresh} disabled={loading}>
          Refresh
        </button>

        <button
          style={activePanel === "depositWithdraw" ? styles.btnActive : styles.btn}
          onClick={() => {
            setError("");
            setActivePanel("depositWithdraw");
          }}
          disabled={loading}
        >
          Deposit / Withdraw
        </button>

        <button
          style={activePanel === "transfer" ? styles.btnActive : styles.btn}
          onClick={() => {
            setError("");
            setActivePanel("transfer");
          }}
          disabled={loading}
        >
          Transfer
        </button>

        <button
          style={activePanel === "details" ? styles.btnActive : styles.btn}
          onClick={() => {
            setError("");
            setActivePanel("details");
          }}
          disabled={loading}
        >
          Load account details
        </button>

        {loading && <span style={{ opacity: 0.8 }}>Loading…</span>}
      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "#620202",
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
            color: "white",
          }}
        >
          <b>Error:</b> {error}
        </div>
      )}

      {/* CONDITIONAL PANEL (ABOVE LIST) */}
      {activePanel !== "none" && (
        <div style={styles.panelBox}>
          {activePanel === "depositWithdraw" && (
            <>
              <h2 style={{ marginTop: 0 }}>Deposit / Withdraw</h2>
              <div style={styles.row}>
                <label>
                  Account{" "}
                  <select
                    style={styles.select}
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {ids.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Amount{" "}
                  <input
                    style={styles.input}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 10"
                  />
                </label>

                <button style={styles.btn} onClick={onDeposit} disabled={loading || !selectedId}>
                  Deposit
                </button>

                <button style={styles.btn} onClick={onWithdraw} disabled={loading || !selectedId}>
                  Withdraw
                </button>

                <button style={styles.btn} onClick={() => setActivePanel("none")} disabled={loading}>
                  Close
                </button>
              </div>
            </>
          )}

          {activePanel === "transfer" && (
            <>
              <h2 style={{ marginTop: 0 }}>Transfer</h2>
              <div style={styles.row}>
                <label>
                  From{" "}
                  <select
                    style={styles.select}
                    value={fromId}
                    onChange={(e) => setFromId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {ids.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  To{" "}
                  <select style={styles.select} value={toId} onChange={(e) => setToId(e.target.value)}>
                    <option value="" disabled>
                      Select…
                    </option>
                    {ids.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Amount{" "}
                  <input
                    style={styles.input}
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </label>

                <button style={styles.btn} onClick={onTransfer} disabled={loading || !fromId || !toId}>
                  Transfer
                </button>

                <button style={styles.btn} onClick={() => setActivePanel("none")} disabled={loading}>
                  Close
                </button>
              </div>
            </>
          )}

          {activePanel === "details" && (
            <>
              <h2 style={{ marginTop: 0 }}>Account details</h2>

              <div style={styles.row}>
                <label>
                  Account{" "}
                  <select
                    style={styles.select}
                    value={detailsAccountId}
                    onChange={(e) => setDetailsAccountId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.id}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  style={styles.btn}
                  onClick={() => loadDetails(detailsAccountId)}
                  disabled={!detailsAccountId || detailsLoading}
                >
                  {detailsLoading ? "Loading…" : "Load details"}
                </button>

                <button
                  style={styles.btn}
                  onClick={() => setActivePanel("none")}
                  disabled={detailsLoading}
                >
                  Close
                </button>
              </div>

              {details && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ marginBottom: 10, opacity: 0.9 }}>
                    <div>
                      <b>ID:</b> <span style={{ fontFamily: "monospace" }}>{details.id}</span>
                    </div>
                    <div>
                      <b>Balance:</b> {details.balance}
                    </div>
                  </div>

                  <h3 style={{ margin: "10px 0" }}>Last outgoing transfers</h3>

                  {details.lastOutgoingTransfers?.length ? (
                    <table width="100%" cellPadding={8} style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeadRow}>
                          <th>Time</th>
                          <th>To</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.lastOutgoingTransfers.map((t, idx) => (
                          <tr key={idx} style={styles.tableRow}>
                            <td>{new Date(t.timestamp).toLocaleString()}</td>
                            <td style={{ fontFamily: "monospace", fontSize: 12 }}>{t.toAccountId}</td>
                            <td>{t.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ opacity: 0.75, marginTop: 8 }}>No outgoing transfers yet.</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ACCOUNTS LIST (ALWAYS VISIBLE) */}
      <h2 style={{ marginTop: 18 }}>Accounts</h2>
      <table width="100%" cellPadding={10} style={styles.table}>
        <thead>
          <tr style={styles.tableHeadRow}>
            <th>ID</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id} style={styles.tableRow}>
              <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.id}</td>
              <td>{a.balance}</td>
            </tr>
          ))}
          {accounts.length === 0 && (
            <tr>
              <td colSpan={2} style={{ opacity: 0.75 }}>
                No accounts yet. Click “Create account”.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
