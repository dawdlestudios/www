import { approveApplication, fetchJson, request } from "../../utils/api";
import styles from "./style.module.css";
import { useQuery } from "../../utils/query";

export const AdminTools = () => {
	const { isLoading, isError } = useQuery({
		queryKey: ["admin"],
		queryFn: () => request("/api/admin", "POST"),
	});

	if (isLoading)
		return (
			<main className={styles.main}>
				<h2>Checking status...</h2>
			</main>
		);

	if (isError)
		return (
			<main className={styles.main}>
				<h2>Unauthorized</h2>
			</main>
		);

	return (
		<main className={styles.main1}>
			<Tools />
		</main>
	);
};

const Tools = () => {
	return (
		<>
			<details open>
				<summary>Applications</summary>
				<Applications />
			</details>
		</>
	);
};

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

const Applications = () => {
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
		<div>
			{dataSorted?.map((application) => {
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
			})}
		</div>
	);
};
