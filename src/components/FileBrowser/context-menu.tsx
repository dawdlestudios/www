import React from "react";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import styles from "./context-menu.module.css";
import { Edit, Edit2, FileIcon, FolderIcon, Trash } from "lucide-react";
import type { DawdleFile } from ".";

export const ContextMenu = (props: {
	items: {
		element: JSX.Element;
		file: DawdleFile;
	}[];
}) => {
	const [target, setTarget] = React.useState<DawdleFile | null>(null);

	return (
		<RadixContextMenu.Root
			onOpenChange={(open) => {
				if (open) {
					// get element at cursor
				}
			}}
		>
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
				}}
			>
				{props.items.map((child) => child.element)}
			</RadixContextMenu.Trigger>
			<RadixContextMenu.Portal>
				<RadixContextMenu.Content className={styles.ContextMenuContent}>
					<Content target={target} />
				</RadixContextMenu.Content>
			</RadixContextMenu.Portal>
		</RadixContextMenu.Root>
	);
};

const Content = ({
	target,
}: {
	target: DawdleFile | null;
}) => {
	if (!target) {
		return (
			<>
				<RadixContextMenu.Item className={styles.ContextMenuItem}>
					Create New Folder
					<div className={styles.RightSlot}>
						<FolderIcon size={16} />
					</div>
				</RadixContextMenu.Item>
				<RadixContextMenu.Item className={styles.ContextMenuItem}>
					Create New File
					<div className={styles.RightSlot}>
						<FileIcon size={16} />
					</div>
				</RadixContextMenu.Item>
			</>
		);
	}

	return (
		<>
			<RadixContextMenu.Item className={styles.ContextMenuItem}>
				Rename
				<div className={styles.RightSlot}>
					<Edit2 size={16} />
				</div>
			</RadixContextMenu.Item>
			{target.type !== "directory" && (
				<RadixContextMenu.Item className={styles.ContextMenuItem}>
					Edit
					<div className={styles.RightSlot}>
						<Edit size={16} />
					</div>
				</RadixContextMenu.Item>
			)}
			<RadixContextMenu.Item data-delete className={styles.ContextMenuItem}>
				Delete
				<div className={styles.RightSlot}>
					<Trash size={16} />
				</div>
			</RadixContextMenu.Item>
		</>
	);
};
