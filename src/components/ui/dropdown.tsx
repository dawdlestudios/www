import styles from "./dropdown.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type DropdownField = {
	label: string | React.ReactNode;
	onClick: () => void;
};

export const Dropdown = ({
	fields,
	children,
}: { fields: (DropdownField | false)[]; children: React.ReactNode }) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
			<DropdownMenu.Content
				side="bottom"
				alignOffset={5}
				align="end"
				className={styles.DropdownMenuContent}
			>
				{fields
					.filter((field): field is DropdownField => typeof field !== "boolean")
					.map((field, i) => (
						<DropdownMenu.Item className={styles.DropdownMenuItem} key={i} onSelect={field.onClick}>
							{field.label}
						</DropdownMenu.Item>
					))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};
