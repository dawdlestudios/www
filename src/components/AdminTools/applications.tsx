import "./table";

import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { CheckIcon, EllipsisVerticalIcon } from "lucide-react";
import {
	approveApplication,
	deleteApplication,
	fetchJson,
	unapproveApplication,
	updateApplicationUsername,
} from "../../utils/api";
import { useQuery } from "../../utils/query";
import { Dropdown } from "../ui/dropdown";
import styles from "./style.module.css";

type Application = {
	about: string;
	approved: boolean;
	claim_token?: string;
	claimed: boolean;
	date: number;
	email: string;
	id: string;
	username: string;
};

export const AdminApplications = () => {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["admin", "applications"],
		queryFn: () => fetchJson<Application[]>("/api/admin/applications"),
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
						headerName: "Date",
						field: "date",
						valueFormatter: (params) => Intl.DateTimeFormat("en-US").format(new Date(params.value)),
					},
					{
						headerName: "Username",
						editable: (c) => !c.data?.approved,
						onCellValueChanged: (e) => {
							updateApplicationUsername(e.data.id, e.newValue)
								.then(() => refetch())
								.catch((e) => console.error(e));
						},
						field: "username",
					},
					{
						headerName: "Email",
						maxWidth: 200,
						field: "email",
						editable: true,
					},
					{
						headerName: "About",
						field: "about",
						editable: true,
						maxWidth: 200,
						cellEditorPopup: true,
						cellEditor: "agLargeTextCellEditor",
					},
					{
						headerName: "Approved",
						field: "approved",
						cellRenderer: (ctx: CustomCellRendererProps) => (ctx.value ? "✅" : "❌"),
					},
					{
						headerName: "Claimed",
						field: "claimed",
						cellRenderer: (ctx: CustomCellRendererProps) => (ctx.value ? "✅" : "❌"),
					},
					{
						pinned: "right",
						lockPosition: true,
						sortable: false,
						resizable: false,
						width: 40,
						cellClass: styles.edit,
						cellRenderer: (ctx: CustomCellRendererProps) => {
							const application = ctx.data as Application;

							return (
								<Dropdown
									fields={[
										!application.approved && {
											label: "Approve",
											onClick: () => {
												approveApplication(application.id)
													.then(() => refetch())
													.catch((e) => console.error(e));
											},
										},
										application.approved &&
											!application.claimed && {
												label: "Unapprove",
												onClick: () => {
													unapproveApplication(application.id)
														.then(() => refetch())
														.catch((e) => console.error(e));
												},
											},
										{
											label: "Delete",
											onClick: () => {
												deleteApplication(application.id)
													.then(() => refetch())
													.catch((e) => console.error(e));
											},
										},
										application.approved && {
											label: "Copy Claim Link",
											onClick: () => {
												navigator.clipboard.writeText(
													`https://dawdle.space/user/claim?token=${application.claim_token}&user=${application.username}`,
												);
											},
										},
									]}
								>
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
