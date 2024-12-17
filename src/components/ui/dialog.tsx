import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactElement, useState } from "react";
import styles from "./dialog.module.css";

export const Dialog = ({
	children,
	content,
	description,
	title,
}: {
	children: ({ onClick }: { onClick: () => void }) => ReactElement;
	content: ReactElement;
	title?: string;
	description?: string;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<RadixDialog.Root
			open={open}
			onOpenChange={(o) => {
				setOpen(o);

				if (!o)
					// timeout so we don't trigger ourselves
					setTimeout(() => {
						document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
					}, 0);
			}}
		>
			{children({
				onClick: () => setOpen(true),
			})}
			<RadixDialog.Portal>
				<RadixDialog.Overlay className={styles.DialogOverlay} />
				<RadixDialog.Content className={styles.DialogContent}>
					{title && <RadixDialog.Title className={styles.DialogTitle}>{title}</RadixDialog.Title>}

					{description && (
						<RadixDialog.Description className={styles.DialogDescription}>
							{description}
						</RadixDialog.Description>
					)}

					{content}
					<RadixDialog.Close asChild>
						<button type="button" className={styles.IconButton} aria-label="Close">
							<X />
						</button>
					</RadixDialog.Close>
				</RadixDialog.Content>
			</RadixDialog.Portal>
		</RadixDialog.Root>
	);
};
