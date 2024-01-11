import useSWR from "swr";
import styles from "./settings.module.css";
import { X } from "lucide-react";
import { fetchJson, removePublicKey, type MeResponse, addPublicKey } from "../../utils/api";

const SAMPLE_KEY =
	"e.g ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHKpHLbfvXYR+OUXeh4GSpX26FJUUbT4UV2lOunYNH3a henry@mypc";

export const UserSettings = () => {
	const { data, error, isLoading, mutate } = useSWR<MeResponse>("/api/me", fetchJson);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (error || !data) {
		return <p>An error occurred.</p>;
	}

	const onAddNewKey = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const [name, key] = [data.get("name") as string, data.get("key") as string];
		addPublicKey(name, key)
			.then(() => {
				e.currentTarget.reset();
				mutate();
			})
			.catch((e) => {
				(e.currentTarget.querySelector("textarea[name=key]") as HTMLInputElement)?.setCustomValidity(
					"Invalid key",
				);
				e.currentTarget.reportValidity();
			});
	};

	return (
		<div className={styles.settings}>
			<h2>Public Keys</h2>
			<p>
				To connect using <a href="/wiki/ssh">SSH</a>, add your public key here.
			</p>
			<ul>
				{data.public_keys?.length === 0 && (
					<li>
						<p>No keys added yet.</p>
					</li>
				)}

				{data.public_keys?.map(([name, key]) => (
					<li key={name}>
						<div>
							<span>{name}</span>
							<code>{key}</code>
						</div>
						<button
							type="button"
							onClick={() => {
								removePublicKey(name)
									.then(() => mutate())
									.catch((e) => console.error(e));
							}}>
							<X color="white" />
						</button>
					</li>
				))}
			</ul>

			<form className={styles.keys} onSubmit={onAddNewKey}>
				<b>Add a new key</b>
				<p>Only Ed25519 keys in OpenSSH format are supported.</p>
				<label htmlFor="add_key_name">Name</label>
				<input id="add_key_name" required type="text" name="name" />
				<label htmlFor="add_key">Key</label>
				<textarea id="add_key" required name="key" placeholder={SAMPLE_KEY} />
				<input type="submit" value="Add" />
			</form>

			<form className={styles.pw}>
				<h2>Password</h2>
				<label htmlFor="userPassword">Current password</label>
				<input id="userPassword" required type="password" autoComplete="current-password" />
				<label htmlFor="newUserPassword">New password</label>
				<input
					id="newUserPassword"
					minLength={10}
					required
					type="password"
					autoComplete="new-password"
				/>
				<input type="submit" value="Change" />
			</form>

			<h2>Custom Domains</h2>
			<p>Coming soon...</p>
		</div>
	);
};
