import { getUser } from "../utils/auth";
const username = getUser();

export const LoginLink = () => {
	if (username) {
		return (
			<li className="login">
				<a href="/user">{username}</a>
			</li>
		);
	}

	return (
		<li className="login">
			<a href="/login">login</a>
		</li>
	);
};
