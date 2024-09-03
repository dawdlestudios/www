import "./table";

import styles from "./style.module.css";
import {
	approveApplication,
	deleteApplication,
	fetchJson,
	unapproveApplication,
	updateApplicationUsername,
} from "../../utils/api";
import { useQuery } from "../../utils/query";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { CheckIcon, EllipsisVerticalIcon } from "lucide-react";
import { Dropdown } from "../ui/dropdown";

type User = {
	username: string;
	created_at: string;
	role?: string;
};

export const AdminUsers = () => {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["admin", "users"],
		queryFn: () => fetchJson<User[]>("/api/admin/users"),
	});

	if (isLoading)
		return (
			<div>
				<p>Loading...</p>
			</div>
		);

	return (
		<div className={`ag-theme-quartz-dark ${styles.table}`}>
			<AgGridReact
				gridOptions={{
					autoSizeStrategy: {
						type: "fitGridWidth",
					},
				}}
				rowData={data}
				columnDefs={[
					{
						headerName: "Username",
						field: "username",
					},
					{
						headerName: "Created At",
						field: "created_at",
						valueFormatter: (params) => Intl.DateTimeFormat("en-US").format(new Date(params.value)),
					},
					{
						headerName: "Role",
						field: "role",
					},
					{
						pinned: "right",
						lockPosition: true,
						sortable: false,
						resizable: false,
						width: 40,
						cellClass: styles.edit,
						cellRenderer: (ctx: CustomCellRendererProps) => {
							const user = ctx.data as User;
							return (
								<Dropdown fields={[]}>
									<EllipsisVerticalIcon />
								</Dropdown>
							);
						},
					},
				]}
			/>
		</div>
	);
};
