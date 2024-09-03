import "./table";

import styles from "./style.module.css";
import { fetchJson } from "../../utils/api";
import { useQuery } from "../../utils/query";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { CheckIcon, EllipsisVerticalIcon } from "lucide-react";
import { Dropdown } from "../ui/dropdown";

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

	const dataSorted = data?.sort((a, b) => b.date - a.date);

	if (isLoading)
		return (
			<div>
				<p>Loading...</p>
			</div>
		);

	return (
		<div className={`ag-theme-quartz-dark ${styles.table}`}>
			<AgGridReact
				columnDefs={[
					{
						headerName: "Date",
						field: "date",
						// format just the date
						valueFormatter: (params) => Intl.DateTimeFormat("en-US").format(new Date(params.value)),
					},
					{
						headerName: "Username",
						editable: true,
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
												// approveApplication(application.id)
												// 	.then(() => refetch())
												// 	.catch((e) => console.error(e));
											},
										},
										{
											label: "Delete",
											onClick: () => {
												// deleteApplication(application.id)
												// 	.then(() => refetch())
												// 	.catch((e) => console.error(e));
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
				gridOptions={{
					autoSizeStrategy: {
						type: "fitGridWidth",
					},
				}}
				rowData={dataSorted}
			/>
			{/* {?.map((application) => {
				return (
					<div className={styles.application} key={application.id}>
						<table>
							<tbody>
								<tr>
									<td>Username</td>
									<td>{application.username}</td>
								</tr>
								<tr>
									<td>Email</td>
									<td>{application.email}</td>
								</tr>
								<tr>
									<td>About</td>
									<td>{application.about}</td>
								</tr>
								{!application.claimed && (
									<>
										<tr>
											<td>Approved</td>
											<td>{application.approved ? "Approved" : "Not approved"}</td>
										</tr>
										{application.approved && (
											<tr>
												<td>Claim link</td>
												<td>
													{application.claim_token
														? `https://dawdle.space/user/claim?token=${application.claim_token}&user=${application.username}`
														: ""}
												</td>
											</tr>
										)}
									</>
								)}
								<tr>
									<td>Claimed</td>
									<td>{application.claimed ? "yes" : "no"}</td>
								</tr>
							</tbody>
						</table>
						{!application.approved && (
							<button
								type="button"
								onClick={() => {
									approveApplication(application.id)
										.then(() => refetch())
										.catch((e) => console.error(e));
								}}
							>
								Approve
							</button>
						)}
					</div>
				);
			})} */}
		</div>
	);
};
