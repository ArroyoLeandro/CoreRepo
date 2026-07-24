import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Percent,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { Messages } from "@/shared/lib/i18n";
import { PageShell } from "@/shared/layout/page-shell";
import { MetricCard } from "./metric-card";

const salesBars = [42, 58, 36, 72, 64, 88, 54, 76, 61, 93, 70, 48];
const trafficPoints = [20, 35, 28, 48, 40, 62, 55, 70, 66, 82, 74, 90];

type Props = {
  labels: Messages["dashboard"];
  userCount: string;
};

export function DashboardHome({ labels, userCount }: Props) {
  const maxBar = Math.max(...salesBars);

  return (
    <PageShell
      eyebrow="Overview"
      title={labels.title}
      description={labels.subtitle}
      actions={
        <span className="inline-flex items-center gap-1 border border-line bg-surface-elevated px-2 py-1 text-xs text-muted">
          <ArrowUpRight className="size-3.5 text-accent" strokeWidth={1.75} />
          +12.4% vs last month
        </span>
      }
      innerClassName="flex flex-col gap-3"
    >
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <MetricCard
          label={labels.metrics.users}
          value={userCount}
          hint="+8 this week"
          icon={Users}
        />
        <MetricCard
          label={labels.metrics.revenue}
          value="$24.8k"
          hint="+4.1% MoM"
          icon={CircleDollarSign}
        />
        <MetricCard
          label={labels.metrics.orders}
          value="1,284"
          hint="92 pending"
          icon={ShoppingBag}
        />
        <MetricCard
          label={labels.metrics.conversion}
          value="3.8%"
          hint="-0.2 pts"
          icon={Percent}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-5">
        <section className="border border-line bg-surface p-3 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {labels.chartSales}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <ArrowUpRight className="size-3 text-accent" />
              healthy
            </span>
          </div>
          <div className="flex h-40 items-end gap-1.5">
            {salesBars.map((value, index) => (
              <div
                key={`bar-${index}`}
                className="flex-1 bg-accent/80"
                style={{ height: `${(value / maxBar) * 100}%` }}
                title={`${value}`}
              />
            ))}
          </div>
        </section>

        <section className="border border-line bg-surface p-3 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {labels.chartTraffic}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <ArrowDownRight className="size-3" />
              stable
            </span>
          </div>
          <svg viewBox="0 0 240 120" className="h-40 w-full" aria-hidden>
            <polyline
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              points={trafficPoints
                .map((y, i) => {
                  const x = (i / (trafficPoints.length - 1)) * 240;
                  const yy = 110 - (y / 100) * 100;
                  return `${x},${yy}`;
                })
                .join(" ")}
            />
            <polyline
              fill="color-mix(in srgb, var(--accent) 18%, transparent)"
              stroke="none"
              points={`0,120 ${trafficPoints
                .map((y, i) => {
                  const x = (i / (trafficPoints.length - 1)) * 240;
                  const yy = 110 - (y / 100) * 100;
                  return `${x},${yy}`;
                })
                .join(" ")} 240,120`}
            />
          </svg>
        </section>
      </div>

      <section className="mt-auto border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {labels.tableTitle}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-elevated">
                {["Order", "Customer", "Status", "Total"].map((label) => (
                  <th
                    key={label}
                    className="px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["#1042", "Ada L.", "Paid", "$128.00"],
                ["#1041", "Alan T.", "Pending", "$64.50"],
                ["#1040", "Grace H.", "Refunded", "$42.00"],
                ["#1039", "Edsger D.", "Paid", "$210.00"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-line last:border-b-0">
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-2 text-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
