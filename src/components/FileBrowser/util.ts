import type { File } from ".";

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
	{
		return `${(size / 1024 / 1024 / 1024).toFixed(2)} GiB`;
	}
}

export function sortFiles(
	files: File[],
	sort: "date" | "name" | "type" = "date",
): File[] {
	// folders are always first
	const folders = files.filter((file) => file.type === "folder");
	const rest = files.filter((file) => file.type !== "folder");

	switch (sort) {
		case "date":
			return [
				...folders,
				...rest.sort((a, b) => b.lastModified - a.lastModified),
			];
		case "name":
			return [...folders, ...rest.sort((a, b) => a.name.localeCompare(b.name))];
		case "type":
			return [...folders, ...rest.sort((a, b) => a.type.localeCompare(b.type))];
	}
}
