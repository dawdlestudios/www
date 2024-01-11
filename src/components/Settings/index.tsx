import useSWR from "swr";
import styles from "./settings.module.css";
import { X } from "lucide-react";

const fetchJson = async <T,>(url: string) => {
	const response = await fetch(url);
	return response.json() as Promise<T>;
};

type MeResponse = {
	username: string;
	public_keys?: [string, string][];
};

const removeKey = async (name: string) => {
	const response = await fetch("/api/public_key", {
		body: JSON.stringify({ name }),
		headers: { "Content-Type": "application/json" },
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Something went wrong");
	}
};

const addKey = async (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	const form = event.currentTarget;
	const body = new FormData(form);
	const response = await fetch("/api/public_key", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: body.get("name"),
			key: body.get("key"),
		}),
	});

	if (response.ok) {
		form.reset();
	} else {
		(
			form.querySelector("textarea[name=key]") as HTMLInputElement
		)?.setCustomValidity("Invalid key");

		form.reportValidity();
	}
};

export const UserSettings = () => {
	const { data, error, isLoading, mutate } = useSWR<MeResponse>(
		"/api/me",
		fetchJson,
	);
	console.log("data", isLoading, data);

	return (
		<div className={styles.settings}>
			<h1>User Settings</h1>
			{isLoading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}
			{data && (
				<>
					<h2>Public Keys</h2>
					<p>
						To connect using <a href="/wiki/ssh">SSH</a>, add your public key
						here.
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
										removeKey(name)
											.then(() => mutate())
											.catch((e) => console.error(e));
									}}
								>
									<X color="white" />
								</button>
							</li>
						))}
					</ul>

					<form
						className={styles.form}
						action="/api/me/keys"
						method="POST"
						onSubmit={(e) => {
							e.preventDefault();
							addKey(e).then(() => mutate());
						}}
					>
						<h3>Add a new key</h3>
						<p>Only Ed25519 keys in OpenSSH format are supported.</p>
						<label>Name</label>
						<input required type="text" name="name" />
						<label>Key</label>
						<textarea
							required
							name="key"
							placeholder={
								"e.g ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHKpHLbfvXYR+OUXeh4GSpX26FJUUbT4UV2lOunYNH3a henry@mypc"
							}
						/>
						<input type="submit" value="Add" />
					</form>

					<h2>Custom Domains</h2>
					<p>Coming soon...</p>
				</>
			)}
		</div>
	);
};
