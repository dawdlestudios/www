import { PlusIcon, X } from "lucide-react";
import { useState } from "react";
import {
	type MeResponse,
	addPublicKey,
	changePassword,
	fetchJson,
	removePublicKey,
	updateMinecraft,
} from "../../utils/api";
import styles from "./settings.module.css";
import { useQuery } from "../../utils/query";
import { getRole, getUser, useUser } from "../../utils/auth";
import { Dialog } from "../ui/dialog";

const SAMPLE_KEY =
	"e.g ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHKpHLbfvXYR+OUXeh4GSpX26FJUUbT4UV2lOunYNH3a you@hostname";

export const SettingsHeader = () => {
	const username = useUser();

	return (
		<main id="settings" className={styles.header}>
			<h2>
				{(username && `Welcome ${username}!`) || <>&nbsp;</>}
				{username && <a href={`https://${username}.dawdle.space`}>&#10697; {username}.dawdle.space</a>}
			</h2>
			<p>
				You can upload files to your account below. Alternatively, you can also connect via{" "}
				<a href="/wiki/guide/ssh">SSH</a> or using a folder on your computer with{" "}
				<a href="/wiki/guide/webdav">WebDAV</a>. If your new here, check out the{" "}
				<a href="/wiki">wiki</a> for more information.
			</p>
		</main>
	);
};

export const UserSettings = () => {
	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["me"],
		queryFn: () => fetchJson<MeResponse>("/api/me"),
	});

	const [changePasswordNote, setChangePasswordNote] = useState<string | null>(null);
	const [changeMinecraftNote, setChangeMinecraftNote] = useState<string | null>(null);

	if (isLoading) {
		return (
			<div className={styles.error}>
				<p>Loading...</p>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className={styles.error}>
				<p>An error occurred.</p>
			</div>
		);
	}

	const onAddNewKey = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const form = e.currentTarget;

		addPublicKey(data.get("add_key_name") as string, data.get("key") as string)
			.then(() => {
				form.reset();
				refetch();
			})
			.catch((e) => {
				console.error(e);
				(form.querySelector("textarea[name=key]") as HTMLInputElement)?.setCustomValidity(
					"Invalid key",
				);
				form.reportValidity();
			});
	};

	const onChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const [currentPassword, newPassword] = [
			data.get("currentPassword") as string,
			data.get("newPassword") as string,
		];

		changePassword(currentPassword, newPassword)
			.then(() => {
				setChangePasswordNote("Password changed successfully.");
				form.reset();
			})
			.catch((e) => {
				console.error(e);
				setChangePasswordNote("An error occurred. Is your current password correct?");
			});
	};

	const onMinecraftUsernameChange = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const username = data.get("minecraftUsername") as string;

		updateMinecraft(username)
			.then(() => {
				setChangeMinecraftNote("Minecraft username updated successfully.");
				refetch();
			})
			.catch((e) => {
				console.error(e);
				setChangeMinecraftNote("An error occurred.");
			});

		return false;
	};

	return (
		<div className={styles.settings}>
			{getRole() === "admin" && (
				<a href="/admin" className={styles.adminLink}>
					<h2>Open Admin Panel</h2>
				</a>
			)}
			<h2>
				Public Keys
				<Dialog
					content={
						<form className={styles.keys} onSubmit={onAddNewKey}>
							<p>Only Ed25519 keys in OpenSSH format are supported.</p>
							<label htmlFor="add_key_name">Name</label>
							<input autoComplete="off" id="add_key_name" required type="text" name="add_key_name" />
							<label htmlFor="add_key">Key</label>
							<textarea
								autoComplete="off"
								rows={4}
								id="add_key"
								required
								name="key"
								placeholder={SAMPLE_KEY}
							/>
							<input type="submit" value="Add" />
						</form>
					}
					title="Add a new public key"
				>
					{({ onClick }) => (
						<button onClick={onClick} type="button">
							<PlusIcon /> New
						</button>
					)}
				</Dialog>
			</h2>
			<p>
				To connect using <a href="/wiki/ssh">SSH</a>, add your public key here.
			</p>
			<ul>
				{(!data.public_keys || data.public_keys?.length === 0) && (
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
									.then(() => refetch())
									.catch((e) => console.error(e));
							}}
						>
							<X color="white" />
						</button>
					</li>
				))}
			</ul>

			<form className={styles.formInline} onSubmit={onChangePassword}>
				<h2>
					Security
					<input type="submit" value="Save" />
				</h2>
				<label htmlFor="userPassword">Current password</label>
				<input
					name="currentPassword"
					id="userPassword"
					required
					type="password"
					autoComplete="current-password"
				/>
				<label htmlFor="newUserPassword">New password</label>
				<input
					id="newUserPassword"
					name="newPassword"
					minLength={10}
					required
					type="password"
					autoComplete="new-password"
				/>
				<div>{changePasswordNote && <p>{changePasswordNote}</p>}</div>
			</form>

			<form className={styles.formInline} onSubmit={onMinecraftUsernameChange}>
				<h2>
					Game Servers
					<input type="submit" value="Save" />
				</h2>
				<label htmlFor="minecraftUsername">Minecraft Username</label>
				<input
					defaultValue={data.minecraft_username}
					id="minecraftUsername"
					type="text"
					name="minecraftUsername"
				/>
				<div>{changeMinecraftNote && <p>{changeMinecraftNote}</p>}</div>
			</form>
		</div>
	);
};
