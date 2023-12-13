import { demoFiles } from "./demo";
import { icons, type FileType } from "./icons";
import { formatSize, sortFiles } from "./util";
import styles from "./styles.module.css";

export type File = {
	name: string;
	type: FileType;
	size: number;
	lastModified: number;
	createDate: number;
};

export const FileBrowser = () => {
	const files = sortFiles(demoFiles);

	return (
		<div className={styles.root}>
			<nav>
				<button type="button">new file</button>
				<button type="button">new folder</button>
				<button type="button">upload</button>
				<input type="text" placeholder="search..." />
			</nav>
			<div className="title">
				<BreadCrumbs path="home/username" />
			</div>
			<div className={styles.items}>
				{files.map((file) => (
					<FileBrowserItem key={file.name} file={file} />
				))}
			</div>
		</div>
	);
};

const BreadCrumbs = ({ path }: { path: string }) => {
	const crumbs = path.split("/");
	const [first, ...rest] = crumbs;

	return (
		<div className={styles.breadcrumbs}>
			<button type="button" className={styles.crumb}>
				/{first}
			</button>
			{rest.map((crumb) => (
				<button type="button" key={crumb} className={styles.crumb}>
					{"/"}
					{crumb}
				</button>
			))}
		</div>
	);
};

const FileBrowserItem = ({ file }: { file: File }) => {
	return (
		<div className={styles.item}>
			<FileIcon className={styles.icon} type={file.type} />
			<h1 className={styles.name}>
				{file.name}
				{file.type !== "folder" && <span>({formatSize(file.size)})</span>}
			</h1>
			<h3 className={styles.date}>
				{Intl.DateTimeFormat("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				}).format(file.createDate)}
			</h3>
		</div>
	);
};

const FileIcon = ({
	type,
	className,
}: { className: string; type: FileType }) => {
	const File = icons[type];

	return <File className={className} />;
};
