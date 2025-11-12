import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  title: string;
  subtitle?: string;
  columns: Column[];
  data: Array<Record<string, string | number>>;
}

export default function DataTable({ title, subtitle, columns, data }: DataTableProps) {
  return (
    <Card className="shadow-xl border-border/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-card to-muted/30 border-b px-4 md:px-6 py-4 md:py-6">
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        {subtitle && <CardDescription className="text-sm md:text-base mt-1">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`font-semibold text-xs md:text-sm whitespace-nowrap ${
                      column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`text-xs md:text-sm whitespace-nowrap ${
                        column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-6 py-4 border-t bg-muted/20">
          <p className="text-xs md:text-sm text-muted-foreground">
            Showing 1 to {data.length} of {data.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="hidden sm:flex">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="icon" disabled className="sm:hidden">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled className="hidden sm:flex">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" size="icon" disabled className="sm:hidden">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}