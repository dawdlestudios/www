export const request = async <T, _>(
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
	data?: Record<string, unknown>,
): Promise<T> =>
	fetch(url, {
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
		method,
	}).then((response) => {
		if (!response.ok) {
			return Promise.reject(response.statusText);
		}

		return response.json();
	});

export const fetchJson = async <T>(url: string) => {
	const response = await fetch(url);
	return response.json() as Promise<T>;
};

export const approveApplication = async (id: string) =>
	request("/api/admin/applications", "POST", { id });

export const sendApplication = async ({
	username,
	about,
	email,
}: { username: string; about: string; email: string }) =>
	request("/api/apply", "POST", { username, about, email });

export const removePublicKey = async (name: string) =>
	request("/api/public_key", "DELETE", { name });

export const addPublicKey = async (name: string, key: string) =>
	request("/api/public_key", "POST", { name, key });

export const changePassword = async (oldPassword: string, newPassword: string) =>
	request("/api/password", "POST", { old_password: oldPassword, new_password: newPassword });

export const claimUsername = async ({
	username,
	token,
	password,
}: { username: string; token: string; password: string }) =>
	request("/api/claim", "POST", { username, token, password });

export type MeResponse = {
	username: string;
	public_keys: string[];
};
