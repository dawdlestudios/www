import { AuthType, createClient } from "webdav";

export type WebDAVClient = ReturnType<typeof createWebDAVClient>;

export const createWebDAVClient = () =>
	createClient("/api/webdav/", {
		authType: AuthType.None,
	});
