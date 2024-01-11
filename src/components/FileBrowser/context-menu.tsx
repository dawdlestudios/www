import React from "react";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import styles from "./context-menu.module.css";
import { Edit, FileIcon, FolderIcon, Trash } from "lucide-react";
import type { DawdleFile } from ".";
import { Dialog } from "../ui/dialog";

export const ContextMenu = (props: {
	items: {
		element: JSX.Element;
		file: DawdleFile;
	}[];
	refresh: () => void;

	onEdit: (file: DawdleFile) => void;
	onRemove: (file: DawdleFile) => void;
	onMove: (file: DawdleFile, newPath: string) => void;

	onCreateFile: (name: string) => void;
	onCreateFolder: (name: string) => void;
}) => {
	const [target, setTarget] = React.useState<DawdleFile | null>(null);

	return (
		<RadixContextMenu.Root>
			<RadixContextMenu.Trigger
				className={styles.ContextMenuTrigger}
				onContextMenu={(e) => {
					if (!(e.target instanceof HTMLElement)) return setTarget(null);

					const file_idx = e.target?.getAttribute("data-file");
					console.log(e.target, file_idx);

					if (file_idx && props.items.length > parseInt(file_idx)) {
						const file = props.items[parseInt(file_idx)].file;
						setTarget(file);
						return;
					}

					setTarget(null);
				}}>
				{props.items.map((child) => child.element)}
			</RadixContextMenu.Trigger>
			<RadixContextMenu.Portal>
				<RadixContextMenu.Content className={styles.ContextMenuContent}>
					<Content
						onEdit={props.onEdit}
						onRemove={props.onRemove}
						onMove={props.onMove}
						onCreateFile={props.onCreateFile}
						onCreateFolder={props.onCreateFolder}
						target={target}
					/>
				</RadixContextMenu.Content>
			</RadixContextMenu.Portal>
		</RadixContextMenu.Root>
	);
};

const Content = ({
	target,
	onCreateFile,
	onCreateFolder,
	onMove: onRename,
	onRemove,
	onEdit,
}: {
	target: DawdleFile | null;
	onCreateFile: (name: string) => void;
	onCreateFolder: (name: string) => void;
	onMove: (oldFile: DawdleFile, newPath: string) => void;
	onRemove: (file: DawdleFile) => void;
	onEdit: (file: DawdleFile) => void;
}) => {
	if (!target) {
		return (
			<>
				<Dialog
					content={
						<InputDialog buttonText="Create Folder" label="Folder Name" onCreate={onCreateFolder} />
					}
					title="Create New Folder">
					{({ onClick }) => (
						<RadixContextMenu.Item
							onSelect={(e) => {
								onClick();
								e.preventDefault();
							}}
							className={styles.ContextMenuItem}>
							Create New Folder
							<div className={styles.RightSlot}>
								<FolderIcon size={16} />
							</div>
						</RadixContextMenu.Item>
					)}
				</Dialog>
				<Dialog
					content={
						<InputDialog
							buttonText="Create File"
							label="File Name"
							defaultValue="untitled.txt"
							onCreate={onCreateFile}
						/>
					}
					title="Create New File">
					{({ onClick }) => (
						<RadixContextMenu.Item
							onSelect={(e) => {
								onClick();
								e.preventDefault();
							}}
							className={styles.ContextMenuItem}>
							Create New File
							<div className={styles.RightSlot}>
								<FileIcon size={16} />
							</div>
						</RadixContextMenu.Item>
					)}
				</Dialog>
			</>
		);
	}

	return (
		<>
			<Dialog
				content={
					<InputDialog
						buttonText="Rename"
						label="New Name"
						defaultValue={target.name}
						onCreate={(newName) => {
							const newPath = target.fullPath.replace(new RegExp(`${target.name}$`), newName);

							onRename(target, newPath);
						}}
					/>
				}
				title="Rename">
				{({ onClick }) => (
					<RadixContextMenu.Item
						onSelect={(e) => {
							onClick();
							e.preventDefault();
						}}
						className={styles.ContextMenuItem}>
						Rename
						<div className={styles.RightSlot}>
							<Edit size={16} />
						</div>
					</RadixContextMenu.Item>
				)}
			</Dialog>
			{target.type !== "directory" && (
				<RadixContextMenu.Item
					className={styles.ContextMenuItem}
					onSelect={() => {
						onEdit(target);
					}}>
					Edit
					<div className={styles.RightSlot}>
						<Edit size={16} />
					</div>
				</RadixContextMenu.Item>
			)}
			{/* TODO */}
			{/* <RadixContextMenu.Item data-delete className={styles.ContextMenuItem}>
				Delete
				<div className={styles.RightSlot}>
					<Trash size={16} />
				</div>
			</RadixContextMenu.Item> */}
		</>
	);
};

const InputDialog = (props: {
	label: string;
	description?: string;
	buttonText: string;
	defaultValue?: string;
	onCreate: (name: string) => void;
}) => {
	const [name, setName] = React.useState(props.defaultValue || "");

	return (
		<div className={styles.Form}>
			{props.description && <p>{props.description}</p>}
			<div>
				<label>{props.label}</label>
				<input value={name} onChange={(e) => setName(e.target.value)} />
			</div>
			<button type="button" onClick={() => props.onCreate(name)}>
				{props.buttonText}
			</button>
		</div>
	);
};
