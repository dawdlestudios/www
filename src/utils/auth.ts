import { useEffect, useState } from "react";

export const getUser = () => {
	if (typeof window === "undefined") return "";

	const username = document.cookie
		.split("; ")
		.find((row) => row.startsWith("clientside_username="))
		?.split("=")[1];
	return username;
};

// so ssr can use this too
export const useUser = () => {
	const [user, setUser] = useState<string | null | undefined>(undefined);

	useEffect(() => {
		const username = getUser();
		setUser(username || null);
	}, []);

	return user;
};
