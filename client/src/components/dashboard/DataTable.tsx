import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchFields?: (keyof T)[];
  title?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchable = true,
  searchFields = [],
  title,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) return data;

    return data.filter((row) =>
      searchFields.some((field) =>
        String(row[field])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchFields]);

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-foreground font-poppins">
          {title}
        </h3>
      )}
      {searchable && searchFields.length > 0 && (
        <Input
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      )}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className="text-foreground font-semibold"
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className="text-foreground"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum dado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Exibindo {filteredData.length} de {data.length} registros
      </p>
    </div>
  );
}
