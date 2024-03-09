import { ArrowUp, File, FileArchive, FileCode, FileImage, FileMusic, Folder } from "lucide-react";

export type FileType =
	| "directory"
	| "file"
	| "image"
	| "audio"
	| "video"
	| "code"
	| "archive"
	| "other";

export const icons = {
	directory: Folder,
	file: File,
	image: FileImage,
	audio: FileMusic,
	video: File,
	code: FileCode,
	archive: FileArchive,
	other: File,
	"..": ArrowUp,
} as const;
