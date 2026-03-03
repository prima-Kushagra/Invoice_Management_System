"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setInvoices(res.data);
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
        Invoices
      </h2>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">

        {invoices.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">
            No invoices found.
          </p>
        )}

        {invoices.map((inv) => (
          <div
            key={inv._id}
            className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
          >
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {inv.invoiceNumber}
              </p>
              <p className="text-xs text-slate-500">
                Status: {inv.status}
              </p>
            </div>

            <p className="text-slate-800 dark:text-white font-semibold">
              ${inv.amount}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}