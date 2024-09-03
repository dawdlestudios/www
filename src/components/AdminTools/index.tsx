import { getRole } from "../../utils/auth";
import styles from "./style.module.css";

export const AdminTools = () => {
	if (!(getRole() === "admin"))
		return (
			<main className={styles.main}>
				<h2>Unauthorized</h2>
			</main>
		);

	return (
		<main className={styles.main1}>
			<ul>
				<li>
					<a href="/admin/applications">Applications</a>
				</li>
				<li>
					<a href="/admin/users">Users</a>
				</li>
			</ul>
		</main>
	);
};
