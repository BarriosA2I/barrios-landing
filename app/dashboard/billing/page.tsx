import { getAccountById, getUserAccounts } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function BillingPage() {
  const accounts = await getUserAccounts();
  const account = accounts[0] ? await getAccountById(accounts[0].id) : null;
  
  const billingCustomer = account?.billingCustomer;
  const labSubscription = account?.labSubscription;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-zinc-400">Manage your subscriptions and payment methods</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Subscriptions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Commercial Lab</h3>
              {labSubscription ? (
                <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                  {labSubscription.status}
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs bg-zinc-500/10 text-zinc-400">
                  Not Subscribed
                </span>
              )}
            </div>
            {labSubscription ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Plan</span>
                  <span className="font-medium">{labSubscription.tier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Billing</span>
                  <span>{labSubscription.billingInterval}</span>
                </div>
                <button className="w-full mt-4 px-4 py-2 border border-[#27272a] rounded-lg text-sm hover:border-[#00CED1]">
                  Manage Plan
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-zinc-500 mb-4">Start producing AI videos</p>
                <button className="px-6 py-2 bg-[#00CED1] text-black font-medium rounded-lg">
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        {billingCustomer?.paymentMethods && billingCustomer.paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {billingCustomer.paymentMethods.map((method) => (
              <div key={method.id} className="p-4 rounded-lg border border-[#27272a] bg-[#141414] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center">
                    <span className="text-xs font-mono">{method.cardBrand?.toUpperCase() || "CARD"}</span>
                  </div>
                  <div>
                    <p className="font-medium">**** {method.cardLast4}</p>
                    <p className="text-sm text-zinc-500">Expires {method.cardExpMonth}/{method.cardExpYear}</p>
                  </div>
                </div>
                {method.isDefault && <span className="text-xs text-[#00CED1]">Default</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-lg border border-dashed border-[#27272a] text-center">
            <p className="text-zinc-500">No payment methods on file</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Invoices</h2>
        {billingCustomer?.invoices && billingCustomer.invoices.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-[#27272a]">
            <table className="w-full">
              <thead className="bg-[#141414]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Invoice</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {billingCustomer.invoices.map((invoice) => (
                  <tr key={invoice.id} className="bg-[#0a0a0a]">
                    <td className="px-4 py-3 font-mono text-sm">{invoice.number || invoice.id}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(invoice.createdAt)}</td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(invoice.amountDue, invoice.currency)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 rounded-lg border border-dashed border-[#27272a] text-center">
            <p className="text-zinc-500">No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
