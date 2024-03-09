import React from "react";
import type { DawdleFile } from ".";

export function formatSize(size: number): string {
	if (size < 1024) {
		return `${size} B`;
	}
	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(2)} KiB`;
	}
	if (size < 1024 * 1024 * 1024) {
		return `${(size / 1024 / 1024).toFixed(2)} MiB`;
	}
	return `${(size / 1024 / 1024 / 1024).toFixed(2)} GiB`;
}

export function sortFiles(
	files: DawdleFile[],
	sort: "date" | "name" | "type" = "name",
): DawdleFile[] {
	// folders are always first
	const folders = files.filter((file) => file.type === "directory");
	const rest = files.filter((file) => file.type !== "directory");

	switch (sort) {
		case "date":
			return [...folders, ...rest.sort((a, b) => b.lastModified - a.lastModified)];
		case "name": {
			const a = rest
				.filter((file) => file.name[0] === ".")
				.sort((a, b) => a.name.localeCompare(b.name));
			const b = rest
				.filter((file) => file.name[0] !== ".")
				.sort((a, b) => a.name.localeCompare(b.name));

			return [...folders, ...a, ...b];
		}
		case "type":
			return [...folders, ...rest.sort((a, b) => a.type.localeCompare(b.type))];
	}
}

export const useHash = (): [string, (newHash: string) => void] => {
	const [hash, setHash] = React.useState(() => window.location.hash);

	const hashChangeHandler = React.useCallback(() => {
		setHash(window.location.hash);
	}, []);

	React.useEffect(() => {
		window.addEventListener("hashchange", hashChangeHandler);
		return () => {
			window.removeEventListener("hashchange", hashChangeHandler);
		};
	}, [hashChangeHandler]);

	const updateHash = React.useCallback(
		(newHash: string) => {
			if (newHash !== hash) {
				window.location.hash = newHash;
			}
		},
		[hash],
	);

	return [hash.slice(1), updateHash];
};
