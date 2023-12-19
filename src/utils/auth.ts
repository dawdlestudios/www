export const getUser = () => {
	const username = document.cookie
		.split("; ")
		.find((row) => row.startsWith("clientside_username="))
		?.split("=")[1];
	return username;
};
