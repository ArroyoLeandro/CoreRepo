type Column = {
  key: string;
  label: string;
};

type Props = {
  title: string;
  columns: Column[];
  emptyLabel: string;
};

export function DataTable({ title, columns, emptyLabel }: Props) {
  return (
    <section className="border border-line bg-surface-elevated">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-muted"
              >
                {emptyLabel}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
