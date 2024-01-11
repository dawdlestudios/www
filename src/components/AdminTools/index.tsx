import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { request } from "../../utils/api";

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
			<details>
				<summary>Guestlist Requests</summary>
				<GuestlistRequests />
			</details>
			<details>
				<summary>Signup Requests</summary>
				<SignupRequests />
			</details>
		</>
	);
};

const GuestlistRequests = () => {
	return (
		<div>
			<p>asdf</p>
		</div>
	);
};

const SignupRequests = () => {
	return (
		<div>
			<p>asdf</p>
		</div>
	);
};
