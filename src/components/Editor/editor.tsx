import { useEffect, useRef, useState } from "react";
import { Editor as EditorMonaco, type OnMount } from "@monaco-editor/react";
import styles from "./editor.module.css";
import { ArrowLeft, Save } from "lucide-react";
import { getUser } from "../../utils/auth";
import { createWebDAVClient } from "../FileBrowser/webdav";
import { disabledFileTypes } from "./disabled-files";

import type { editor } from "monaco-editor";

const webdav = createWebDAVClient();
const user = getUser();

const loadFile = async (path: string) => {
	const content = await webdav.getFileContents(path, {
		format: "text",
	});
	return content as string;
};

const saveFile = async (path: string, content: string) => {
	await webdav.putFileContents(path, content, {
		overwrite: true,
	});
};

export const Editor = () => {
	const editorRef = useRef<editor.IStandaloneCodeEditor | undefined>(undefined);
	const [fileName, setFilename] = useState<string>();
	const [active, setActive] = useState(false);

	const fileValue = useRef<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setFilename(window?.location?.hash.slice(1));
		setActive(true);
		editorRef.current?.render();

		return () => {
			editorRef.current?.dispose();
		};
	}, []);

	useEffect(() => {
		const f = async () => {
			const content = await loadFile(fileName as string);
			fileValue.current = content;
			setLoading(false);
		};

		if (fileName && loading) f();
	}, [fileName, loading]);

	const onSave = () => {
		const value = editorRef.current?.getValue();
		if (value && fileName) {
			saveFile(fileName, value);
		}
	};

	const onMount: OnMount = (editor, monaco) => {
		if (!fileName) return;

		for (const model of monaco.editor.getModels()) {
			model.dispose();
		}

		editor.setModel(null);

		let lang = undefined;
		if (
			fileName.endsWith(".zshrc") ||
			fileName.endsWith(".zshenv") ||
			fileName.endsWith(".zprofile") ||
			fileName.endsWith(".zlogin") ||
			fileName.endsWith(".zlogout") ||
			fileName.endsWith(".zsh") ||
			fileName.endsWith(".zsh-theme")
		) {
			lang = "shell";
		}

		editor.setModel(
			monaco.editor.createModel(
				fileValue.current || "",
				lang,
				monaco.Uri.file(fileName),
			),
		);

		editorRef.current = editor;
		monaco.editor.defineTheme("dawdle", {
			base: "vs-dark",
			inherit: true,
			rules: [],
			colors: {
				"editor.background": "#080f14",
			},
		});
		monaco.editor.setTheme("dawdle");
		monaco.editor.addCommand({ id: "save", run: onSave });

		monaco.editor.addKeybindingRule({
			keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
			command: "save",
		});
	};

	let loadingMessage = null;
	if (active && !fileName) loadingMessage = <div>Missing file path.</div>;
	if (active && disabledFileTypes.includes(fileName?.split(".").pop() || ""))
		loadingMessage = <div>File type not supported.</div>;

	const path = active ? `home/${user}${fileName}` : "home/";

	return (
		<div className={styles.root}>
			<nav>
				<button
					type="button"
					onClick={() => {
						// window.parent.postMessage({ type: "goBack" }, "*");
						window.history.back();
					}}
				>
					<ArrowLeft size={17} />
					back
				</button>
				<h2>
					{path.split("/").map((part, i) => [
						<span key={`${part}-${i}-a`} className={styles.slash}>
							/
						</span>,
						<span key={`${part}-${i}-b`} className={styles.path}>
							{part}
						</span>,
					])}
				</h2>
				<button
					type="button"
					onClick={() =>
						editorRef.current?.trigger(undefined, "save", undefined)
					}
				>
					<Save size={17} />
					Save
				</button>
			</nav>
			<div>
				{loadingMessage && loadingMessage}

				{!loading && !loadingMessage && (
					<EditorMonaco
						onMount={onMount}
						options={{
							fontFamily: "Victor Mono Variable",
							padding: {
								top: 20,
							},
							model: null,
						}}
					/>
				)}
			</div>
		</div>
	);
};
