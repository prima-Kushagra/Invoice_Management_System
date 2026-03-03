"use client";

import { useState } from "react";

export default function Invoices() {
  const [invoices, setInvoices] = useState([
    { id: 1, client: "Acme Inc", amount: 1200 },
  ]);

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">Invoices</h2>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        {invoices.map((inv) => (
          <div key={inv.id} className="flex justify-between py-2 border-b">
            <p>{inv.client}</p>
            <p>${inv.amount}</p>
          </div>
        ))}
      </div>

    </div>
  );
}