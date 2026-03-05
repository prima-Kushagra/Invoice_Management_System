"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

const defaultItem = (): InvoiceItem => ({ description: "", quantity: 1, price: 0 });

const defaultForm = () => ({
  clientName: "",
  clientEmail: "",
  issueDate: "",
  dueDate: "",
  tax: "",
  notes: "",
});

export default function Invoices() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [invoices, setInvoices] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm());
  const [items, setItems] = useState<InvoiceItem[]>([defaultItem()]);

  const fetchInvoices = async () => {
    if (!token) return;
    try {
      const res = await api.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices
    .filter((inv) =>
      (inv.clientName || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((inv) =>
      filter === "all"
        ? true
        : (inv.status || "").toLowerCase() === filter.toLowerCase()
    );

  const totalPages = Math.ceil(filteredInvoices.length / perPage);
  const paginatedInvoices = filteredInvoices.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const statusBadge = (status: string) => {
    const base =
      "inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium";

    if (status === "paid")
      return `${base} bg-green-100 text-green-700`;

    if (status === "overdue")
      return `${base} bg-red-100 text-red-700`;

    return `${base} bg-yellow-100 text-yellow-700`;
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const sanitisedItems = items.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0,
      }));

      const payload = {
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        issueDate: form.issueDate,
        dueDate: form.dueDate,
        tax: Number(form.tax) || 0,
        discount: 0,
        notes: form.notes,
        items: sanitisedItems,
      };

      await api.post("/invoices", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);
      setForm(defaultForm());
      setItems([defaultItem()]);
      fetchInvoices();
    } catch {
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (invoice: any) => {
    try {
      const order = await api.post("/payments/create-order", {
        invoiceId: invoice._id,
        total: invoice.total,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.data.amount,
        currency: order.data.currency,
        name: "Invoice SaaS",
        order_id: order.data.id,
        handler: async function () {
          await api.patch(`/invoices/${invoice._id}/pay`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchInvoices();
          alert("Payment successful!");
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch {
      alert("Failed to initiate payment");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Invoices
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + New Invoice
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search by client name..."
        className="border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg 
        bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter */}
      <div className="flex gap-3">
        {["all", "pending", "paid", "overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">

        <div className="grid grid-cols-5 px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 dark:text-slate-300">
          <span>Client</span>
          <span>Total</span>
          <span>Status</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        {paginatedInvoices.map((inv) => (
          <div
            key={inv._id}
            className="grid grid-cols-5 px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-sm items-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <div>
              <p className="font-bold">{inv.clientName}</p>
              <p className="text-xs text-slate-500">{inv.clientEmail}</p>
            </div>

            <span>₹{inv.total}</span>

            <span className={statusBadge(inv.status)}>
              {inv.status}
            </span>

            <span>
              {inv.issueDate
                ? new Date(inv.issueDate).toLocaleDateString()
                : "-"}
            </span>

            <div>
              {inv.status !== "paid" && (
                <button
                  onClick={() => handlePay(inv)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Pay
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-[600px] space-y-4 max-h-[90vh] overflow-y-auto text-slate-700 dark:text-slate-200">

            <h3 className="text-lg font-semibold">
              Create Invoice
            </h3>

            <input
              placeholder="Client Name"
              className="w-full border border-slate-300 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700"
              value={form.clientName}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  clientName: e.target.value,
                }))
              }
            />

            <input
              placeholder="Client Email"
              className="w-full border border-slate-300 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700"
              value={form.clientEmail}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  clientEmail: e.target.value,
                }))
              }
            />

          </div>
        </div>
      )}
    </div>
  );
}