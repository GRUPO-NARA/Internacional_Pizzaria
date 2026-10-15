"use client";

import { useEffect } from "react";
import { logClientError } from "./mvp-store";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logClientError(`${error.message}${error.digest ? ` (${error.digest})` : ""}`, "error-boundary");
  }, [error]);

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f3f1ed" }}>
    <div style={{ maxWidth: 520, padding: 32, borderRadius: 24, background: "white", textAlign: "center" }}>
      <h1 style={{ fontFamily: "Georgia, serif" }}>Algo não saiu como esperado.</h1>
      <p>O erro foi registrado localmente para o gerente. Você pode tentar novamente sem perder o pedido salvo.</p>
      <button onClick={reset} style={{ border: 0, borderRadius: 999, padding: "13px 20px", background: "#c9292f", color: "white", fontWeight: 700 }}>Tentar novamente</button>
    </div>
  </main>;
}
