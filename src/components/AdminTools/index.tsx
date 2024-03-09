import { useEffect, useState } from "react";
import useSWR from "swr";
import { approveApplication, request } from "../../utils/api";
import styles from "./style.module.css";

export const AdminTools = () => {
	const [admin, setAdmin] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		request("/api/admin", "POST")
			.then(() => {
				setAdmin(true);
			})
			.catch(() => {
				setAdmin(false);
			});
	}, []);

	if (typeof admin === "undefined") {
		return (
			<main className={styles.main}>
				<h2>Checking status...</h2>
			</main>
		);
	}

	if (!admin) {
		return (
			<main className={styles.main}>
				<h2>Unauthorized</h2>
			</main>
		);
	}

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
			{/* <details>
				<summary>Guestlist Requests</summary>
				<GuestlistRequests />
			</details> */}
		</>
	);
};

// const GuestlistRequests = () => {
// 	return (
// 		<div>
// 			<p>Nothing here yet</p>
// 		</div>
// 	);
// };

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
	const { data, isLoading, mutate } = useSWR<Application[]>("/api/admin/applications", request);

	const dataSorted = data?.sort((a, b) => b.date - a.date);

	if (isLoading) {
		return (
			<div>
				<p>Loading...</p>
			</div>
		);
	}

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
										.then(() => mutate())
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
