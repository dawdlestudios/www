import {
	FileArchive,
	File,
	FileMusic,
	FileImage,
	FileCode,
} from "lucide-react";

export type FileType =
	| "folder"
	| "file"
	| "image"
	| "audio"
	| "video"
	| "code"
	| "archive"
	| "other";

export const icons: Record<FileType, typeof File> = {
	folder: File,
	file: File,
	image: FileImage,
	audio: FileMusic,
	video: File,
	code: FileCode,
	archive: FileArchive,
	other: File,
};
