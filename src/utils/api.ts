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

export const removePublicKey = async (name: string) =>
	request("/api/public-key", "DELETE", { name });

export const addPublicKey = async (name: string, key: string) =>
	request("/api/public-key", "POST", { name, key });

export const claimUsername = async (name: string, token: string, password: string) =>
	request("/api/claim-username", "POST", { name, token, password });

export type MeResponse = {
	username: string;
	public_keys: string[];
};
