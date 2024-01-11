import { useCallback, useEffect, useState } from "react";

import type { FileStat } from "webdav";
import { navigate } from "astro:transitions/client";

import styles from "./styles.module.css";

import { getUser } from "../../utils/auth";
import { createWebDAVClient } from "./webdav";
import { icons, type FileType } from "./icons";
import { formatSize, sortFiles } from "./util";
import { ContextMenu } from "./context-menu";

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
	const [files, setFiles] = useState<DawdleFile[]>([]);
	const [active, setActive] = useState(false);
	const [loading, setLoading] = useState(true);

	const loadDirectory = useCallback(async (path: string) => {
		setLoading(true);
		const files = (await webdav.getDirectoryContents(path)) as FileStat[];
		setFiles(sortFiles(files.map(toFile)));
		setLoading(false);
	}, []);

	useEffect(() => setActive(true), []);

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

	useEffect(() => {
		loadDirectory(directory);
	}, [loadDirectory, directory]);

	const refresh = useCallback(() => {
		loadDirectory(directory);
	}, [loadDirectory, directory]);

	const path = active ? `home/${username}${directory}` : "/home/";

	return (
		<div className={styles.root}>
			<div>
				<BreadCrumbs goto={changeDirectory} path={path} />
			</div>
			<Directory
				canGoBack={directory !== ""}
				goBack={() => {
					const newDir = directory.split("/").slice(0, -1).join("/");
					changeDirectory(newDir);
				}}
				loading={loading}
				files={files}
				path={directory}
				refresh={refresh}
				onClickFile={(file) => {
					if (file.type === "directory") {
						return changeDirectory(file.fullPath);
					}
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
	canGoBack: boolean;
	path: string;
	goBack: () => void;
	refresh: () => void;
}) => {
	if (props.loading) {
		return (
			<div className={styles.items}>
				<div className={styles.loading}>{/* loading... */}</div>
			</div>
		);
	}

	return (
		<div className={styles.items}>
			{props.canGoBack && (
				<FileBrowserItem fileIndex={-1} key=".." file={DOT_DOT_FILE} onClick={props.goBack} />
			)}

			<ContextMenu
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

const BreadCrumbs = ({ path, goto }: { path: string; goto: (path: string) => void }) => {
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
