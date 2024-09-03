import { fetchJson } from "../../utils/api";
import { useQuery } from "../../utils/query";
import styles from "./sites.module.css";

type Site = {
	type: "user" | "site";
	username: string;
	hostname?: string;
};

export const SitesList = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["sites"],
		queryFn: () => fetchJson<Site[]>("/api/sites"),
	});

	const users = data?.filter((site) => site.type === "user" && site.username !== "test");
	const sites = data?.filter((site) => site.type === "site");

	return (
		<main className={styles.main}>
			{isLoading && <p>Loading...</p>}
			{error && <p>Error loading sites</p>}

			{!isLoading && (
				<>
					<h1>Members</h1>
					<ul>
						{users?.map((user) => (
							<li key={user.username}>
								{">>"} <a href={`https://${user.username}.dawdle.space`}>~{user.username}</a>
							</li>
						))}
					</ul>

					<h1>Sites</h1>
					<ul>
						{sites?.map((site) => {
							const actualHostname = site.hostname?.includes(".")
								? site.hostname
								: `${site.hostname}.dawdle.space`;
							return (
								<li key={site.hostname}>
									{">>"} <a href={`https://${actualHostname}`}>{site.hostname}</a> by{" "}
									<a href={`https://${site.username}.dawdle.space`}>~{site.username}</a>
								</li>
							);
						})}
					</ul>
				</>
			)}
		</main>
	);
};
