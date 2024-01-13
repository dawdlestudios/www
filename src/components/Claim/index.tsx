import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useUser } from "../../utils/auth";
import styles from "./claim.module.css";
import { claimUsername } from "../../utils/api";
import { useState } from "react";

export const ClaimUsername = () => {
	const user = useUser();
	const [error, setError] = useState<string | null>(null);

	const searchParams = new URLSearchParams(window?.location.search);

	const newUser = searchParams.get("user");
	const token = searchParams.get("token");

	if (user || !newUser || !token) {
		navigate("/");
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.target as HTMLFormElement);
		const password = data.get("newpw") as string;

		claimUsername({ username: newUser as string, password, token: token as string })
			.then(() => {
				navigate("/login");
			})
			.catch((e) => {
				console.error(e);
				setError("An error occurred.");
			});
	};

	if (error) {
		return (
			<main className={styles.main}>
				<h2>Something went wrong</h2>
				<p>{error} This username may have already been claimed.</p>
			</main>
		);
	}

	return (
		<main className={styles.main}>
			<h2>{(newUser && `Almost there, ${newUser}!`) || " "}</h2>
			<p>
				You're here because you've been accepted to <strong>dawdle.space</strong>. Below, you can choose
				your new password.
			</p>
			<p>
				You can find the terms ("rules") and privacy policy (which you've already agreed to by signing
				up) at the bottom of the page.
			</p>

			<form onSubmit={handleSubmit}>
				<label htmlFor="newpw">Your new password</label>
				<input name="newpw" minLength={10} required type="password" autoComplete="new-password" />
				<input type="submit" value="Submit" />
			</form>
		</main>
	);
};
