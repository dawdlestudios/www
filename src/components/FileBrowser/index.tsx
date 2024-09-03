import { useCallback, useEffect, useRef, useState } from "react";

import { navigate } from "astro:transitions/client";
import type { FileStat } from "webdav";

import styles from "./styles.module.css";

import { getUser } from "../../utils/auth";
import { ContextMenu } from "./context-menu";
import { type FileType, icons } from "./icons";
import { formatSize, sortFiles } from "./util";
import { createWebDAVClient } from "./webdav";
import { useQuery } from "../../utils/query";

export type DawdleFile = {
	name: string;
	fullPath: string;
	type: FileType;
	size: number;
	lastModified: number;
};

const toFile = (file: FileStat): DawdleFile => ({
	name: file.basename,
	fullPath: file.filename,
	type: file.type,
	size: file.size,
	lastModified: +new Date(file.lastmod),
});

const webdav = createWebDAVClient();
const username = getUser();

let location: Location;
if (typeof window !== "undefined") {
	location = window.location;
} else {
	location = {} as Location;
}

export const FileBrowser = () => {
	const [directory, setDirectory] = useState(location?.hash?.slice(1));
	const path = `home/${username}${directory}`;
	const uploadRef = useRef<HTMLInputElement>(null);

	const {
		data: files,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["webdav", "dir", directory],
		queryFn: async () => {
			const files = (await webdav.getDirectoryContents(directory)) as FileStat[];
			return sortFiles(files.map(toFile));
		},
	});

	const changeDirectory = useCallback((path: string) => {
		setDirectory(path);
		navigate(`${window.location.href.split("#")[0]}${path && `#${path}`}`);
	}, []);

	useEffect(() => {
		const onLoad = () => setDirectory(location.hash.slice(1));
		const hashChangeHandler = () => setDirectory(location.hash.slice(1));
		window.addEventListener("hashchange", hashChangeHandler);
		document.addEventListener("astro:page-load", onLoad);
		return () => {
			window.removeEventListener("hashchange", hashChangeHandler);
			document.removeEventListener("astro:page-load", onLoad);
		};
	});

	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const promises = Array.from(e.target.files)
			.filter((file) => file)
			.map(async (file) =>
				webdav.putFileContents(`${directory}/${file.name}`, await file.arrayBuffer()),
			);

		e.target.value = "";
		Promise.all(promises).then(() => refetch());
	};

	return (
		<div className={styles.root}>
			<div>
				<BreadCrumbs goto={changeDirectory} path={path} />
			</div>
			{/* allow multiple files */}
			<input
				type="file"
				ref={uploadRef}
				onChange={handleUpload}
				style={{ display: "none" }}
				multiple
			/>
			<Directory
				canGoBack={directory !== ""}
				goBack={() => {
					const newDir = directory.split("/").slice(0, -1).join("/");
					changeDirectory(newDir);
				}}
				loading={isLoading}
				files={files || []}
				path={directory}
				refresh={refetch}
				onUploadFile={() => uploadRef.current?.click()}
				onClickFile={(file) => {
					if (file.type === "directory") return changeDirectory(file.fullPath);
					navigate(`/user/edit#${file.fullPath}`);
				}}
			/>
		</div>
	);
};

const DOT_DOT_FILE: DawdleFile = {
	name: "..",
	fullPath: "..",
	type: "directory",
	size: 0,
	lastModified: 0,
};

const Directory = (props: {
	loading: boolean;
	files: DawdleFile[];
	onClickFile: (file: DawdleFile) => void;
	onUploadFile: () => void;
	canGoBack: boolean;
	path: string;
	goBack: () => void;
	refresh: () => void;
}) => {
	if (props.loading) {
		return (
			<div className={styles.items}>
				<div className={styles.loading} />
			</div>
		);
	}

	return (
		<div className={styles.items}>
			{props.canGoBack && (
				<FileBrowserItem fileIndex={-1} key=".." file={DOT_DOT_FILE} onClick={props.goBack} />
			)}

			<ContextMenu
				onUploadFile={props.onUploadFile}
				refresh={props.refresh}
				onEdit={(file) => {
					navigate(`/user/edit#${file.fullPath}`);
				}}
				onRemove={(file) => {
					webdav.deleteFile(file.fullPath);
					props.refresh();
				}}
				onMove={(file, newPath) => {
					webdav.moveFile(file.fullPath, newPath);
					props.refresh();
				}}
				onCreateFile={(name) => {
					webdav.putFileContents(`${props.path}/${name}`, "");
					props.refresh();
				}}
				onCreateFolder={(name) => {
					webdav.createDirectory(`${props.path}/${name}`);
					props.refresh();
				}}
				items={props.files.map((file, i) => ({
					file,
					element: (
						<FileBrowserItem
							fileIndex={i}
							key={file.name}
							file={file}
							onClick={() => props.onClickFile(file)}
						/>
					),
				}))}
			/>
		</div>
	);
};

const BreadCrumbs = ({ path }: { path: string; goto: (path: string) => void }) => {
	const crumbs = path.split("/").filter((crumb) => crumb !== "");
	const [first, user, ...rest] = crumbs;

	return (
		<div className={styles.breadcrumbs}>
			<button type="button" className={styles.crumb}>
				<span className={styles.slash}>{"/"}</span>
				{first}
			</button>
			<button type="button" className={styles.crumb}>
				<span className={styles.slash}>{"/"}</span>
				{user}
			</button>

			{rest.map((crumb) => (
				<button type="button" key={crumb} className={styles.crumb}>
					<span className={styles.slash}>{"/"}</span>
					{crumb}
				</button>
			))}
		</div>
	);
};

const FileBrowserItem = ({
	file,
	fileIndex,
	onClick,
}: { file: DawdleFile; fileIndex: number; onClick: () => void }) => {
	return (
		<button type="button" className={styles.item} onClick={onClick} data-file={fileIndex}>
			{file.name === ".." ? (
				<FileIcon type=".." className={styles.icon} />
			) : (
				<FileIcon type={file.type} className={styles.icon} />
			)}
			<h1 className={styles.name}>
				{file.name}
				{file.type !== "directory" && <span>({formatSize(file.size)})</span>}
			</h1>
			<h3 className={styles.date}>
				{!!file.lastModified &&
					Intl.DateTimeFormat("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					}).format(file.lastModified)}
			</h3>
		</button>
	);
};

const FileIcon = ({ type, className }: { className: string; type: keyof typeof icons }) => {
	const File = icons[type];
	return <File className={className} />;
};
