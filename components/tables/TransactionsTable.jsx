import * as React from 'react';
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { QueryErrorResetBoundary, useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { useUser } from '@clerk/clerk-react';
import { Badge } from '../ui/badge';

export const TransactionsTable = ({ data = [] }) => {
	const { user } = useUser();
	const email = user.primaryEmailAddress.emailAddress;
	const {
		data: transactions,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['transactions'],
		queryFn: async () => {
			// return [];
			const { data: transactions, error } = await supabase
				.from('transactions')
				.select('*')
				.order('created_at', { ascending: false })
				.eq('email', email);
			console.log(transactions);
			if (error) console.log(error);
			else return transactions;
		},
	});

	return (
		<div className="w-full">
			<QueryErrorResetBoundary>
				<TransactionsTable1 data={transactions} />
			</QueryErrorResetBoundary>
		</div>
	);
};

export function TransactionsTable1({ data = [] }) {
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState();
	const [columnVisibility, setColumnVisibility] = React.useState({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [statusFilter, setStatusFilter] = React.useState('all');

	const columns = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'amount',
			header: () => (
				<Button variant="ghost" className="truncate" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Amount
					<CaretSortIcon className="w-4 h-4 ml-2" />
				</Button>
			),
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue('amount'));

				// Format the amount as a dollar amount
				const formatted = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'INR',
				}).format(amount);

				return <div className="font-medium text-right">{formatted}</div>;
			},
		},
		{
			accessorKey: 'status',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="capitalize">
						status
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="lowercase">
					<Badge variant={row.getValue('status').includes('fail') ? 'destructive' : ''}>{row.getValue('status') || 'unknown'}</Badge>
				</div>
			),
		},
		{
			accessorKey: 'type',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="capitalize">
						Type
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="lowercase">
					<Badge variant="">{row.getValue('type') || 'unknown'}</Badge>
				</div>
			),
		},
		{
			accessorKey: 'email',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="truncate" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Email
						<CaretSortIcon className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
		},
		{
			accessorKey: 'created_at',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="truncate break-keep w-max">
						Created At
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="capitalize">
					<time dateTime={row.getValue('created_at')}>
						{row.getValue('created_at').slice(0, 10)} {row.getValue('created_at').slice(12, 19)}
					</time>
				</div>
			),
		},
		{
			accessorKey: 'last_name',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="truncate break-keep w-max">
						Last Name
					</Button>
				);
			},
			cell: ({ row }) => <div className="capitalize">{row.getValue('last_name')} </div>,
		},
		{
			accessorKey: 'livemode',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="capitalize">
						livemode
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="lowercase">
					<Badge variant={row.getValue('livemode') ? '' : 'outline'}>{row.getValue('livemode') ? 'livemode' : 'testmode'}</Badge>
				</div>
			),
		},
		{
			accessorKey: 'id',
			header: ({ column }) => {
				return <Button variant="ghost">ID</Button>;
			},
			cell: ({ row }) => <div className="uppercase">{row.getValue('id')}</div>,
		},
		{
			accessorKey: 'order_id',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="capitalize w-max">
						order ID
					</Button>
				);
			},
			cell: ({ row }) => <div className="uppercase ">{row.getValue('order_id')}</div>,
		},
		{
			accessorKey: 'user_id',
			header: ({ column }) => {
				return <Button variant="ghost">User ID</Button>;
			},
			cell: ({ row }) => <div className="uppercase">{row.getValue('user_id')}</div>,
		},
		{
			accessorKey: 'event_id',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="w-max">
						Event ID
					</Button>
				);
			},
			cell: ({ row }) => <div className="uppercase">{row.getValue('event_id')}</div>,
		},
		{
			accessorKey: 'event',
			header: ({ column }) => {
				return (
					<Button variant="ghost" className="w-max">
						Event
					</Button>
				);
			},
			cell: ({ row }) => <div className="uppercase">{row.getValue('event')}</div>,
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) => {
				const slot = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="w-8 h-8 p-0">
								<span className="sr-only">Open menu</span>
								<DotsHorizontalIcon className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(slot.id)}>{JSON.stringify(slot)}</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>View customer</DropdownMenuItem>
							<DropdownMenuItem>View payment details</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="w-full">
			<div className="flex items-center gap-2 py-4">
				{/* <Input
					placeholder="Filter emails..."
					value={table.getColumn('email')?.getFilterValue() ?? ''}
					onChange={event => table.getColumn('email')?.setFilterValue(event.target.value)}
					className="max-w-xs"
				/> */}

				<Input
					placeholder="Search slot..."
					value={table.getColumn('slot')?.getFilterValue() ?? ''}
					onChange={event => table.getColumn('slot')?.setFilterValue(event.target.value)}
					className="max-w-xs"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Open</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>Panel Position</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={statusFilter}
							onChange={event => table.getColumn('status')?.setFilterValue(statusFilter.toLowerCase())}
							onValueChange={setStatusFilter}
						>
							<DropdownMenuRadioItem value="top">success</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="bottom">failed</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="right">error</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="right">live</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="right">inactive</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDownIcon className="w-4 h-4 ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="overflow-y-auto max-h-96">
						{table
							.getAllColumns()
							.filter(column => column.getCanHide())
							.map(column => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={value => column.toggleVisibility(!!value)}
									>
										{/* {column.id} */}
										{/* replace _ with ' ' and capitalize first letter of everyword */}
										{column.id.replace(/_/g, ' ').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="border rounded-md">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<>
											<TableHead key={header.id}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										</>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-end py-4 space-x-2">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>
					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
