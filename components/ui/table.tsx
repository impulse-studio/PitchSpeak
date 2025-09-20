// AlignUI Table v0.0.0
/** biome-ignore-all lint/a11y/noAriaHiddenOnFocusable: Imported from external library */

import * as React from "react";

import * as Divider from "@/components/ui/divider";
import { cn } from "@/lib/utils/cn";

const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full" ref={forwardedRef} {...rest} />
    </div>
  );
});
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ ...rest }, forwardedRef) => {
  return <thead ref={forwardedRef} {...rest} />;
});
TableHeader.displayName = "TableHeader";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <th
      className={cn(
        "bg-bg-weak-50 px-3 py-2 text-left text-paragraph-sm text-text-sub-600 first:rounded-l-lg last:rounded-r-lg",
        className
      )}
      ref={forwardedRef}
      {...rest}
    />
  );
});
TableHead.displayName = "TableHead";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    spacing?: number;
  }
>(({ spacing = 8, ...rest }, forwardedRef) => {
  return (
    <>
      {/* to have space between thead and tbody */}
      <tbody
        aria-hidden="true"
        className="table-row"
        style={{
          height: spacing,
        }}
      />

      <tbody ref={forwardedRef} {...rest} />
    </>
  );
});
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <tr className={cn("group/row", className)} ref={forwardedRef} {...rest} />
  );
});
TableRow.displayName = "TableRow";

function TableRowDivider({
  className,
  dividerClassName,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Divider.Root> & {
  dividerClassName?: string;
}) {
  return (
    <tr aria-hidden="true" className={className}>
      <td className="py-1" colSpan={999}>
        <Divider.Root
          className={dividerClassName}
          variant="line-spacing"
          {...rest}
        />
      </td>
    </tr>
  );
}
TableRowDivider.displayName = "TableRowDivider";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <td
      className={cn(
        "h-16 px-3 transition duration-200 ease-out first:rounded-l-xl last:rounded-r-xl group-hover/row:bg-bg-weak-50",
        className
      )}
      ref={forwardedRef}
      {...rest}
    />
  );
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...rest }, forwardedRef) => (
  <caption
    className={cn("mt-4 text-paragraph-sm text-text-sub-600", className)}
    ref={forwardedRef}
    {...rest}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table as Root,
  TableHeader as Header,
  TableBody as Body,
  TableHead as Head,
  TableRow as Row,
  TableRowDivider as RowDivider,
  TableCell as Cell,
  TableCaption as Caption,
};
