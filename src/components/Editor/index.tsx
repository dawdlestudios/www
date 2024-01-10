import { useEffect, useRef, useState } from "react";
import { Editor as EditorMonaco, type OnMount } from "@monaco-editor/react";
import { Uri, editor } from "monaco-editor";
import { emmetHTML } from "emmet-monaco-es";
import styles from "./editor.module.css";
import { ArrowLeft, Save } from "lucide-react";
import { getUser } from "../../utils/auth";
import { createWebDAVClient } from "../FileBrowser/webdav";

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

// binary files
const disabledFileTypes = [
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"ico",
	"exe",
	"webm",
	"mp4",
	"mp3",
	"wav",
	"ogg",
	"zip",
	"tar",
	"gz",
	"rar",
	"7z",
	"pdf",
	"doc",
	"docx",
	"xls",
	"xlsx",
	"ppt",
	"pptx",
	"odt",
	"ods",
	"odp",
	"rtf",
	"epub",
	"swf",
	"flv",
	"m4v",
	"mkv",
	"avi",
	"mov",
	"wmv",
	"mpg",
	"mp2",
	"mpeg",
	"mpe",
	"mpv",
	"m4p",
	"m4v",
	"mpg",
	"mp2",
	"mpeg",
	"mpe",
	"mpv",
	"m4p",
	"m4v",
	"avi",
	"wmv",
	"mov",
	"qt",
	"flv",
	"swf",
	"avchd",
	"webm",
	"aac",
	"aiff",
	"ape",
	"flac",
	"m4a",
	"m4b",
	"mka",
	"mp3",
	"mpc",
	"ogg",
	"oga",
	"opus",
	"ra",
	"rm",
	"wav",
	"wma",
	"3g2",
	"3gp",
	"asf",
	"asx",
	"avi",
	"flv",
	"m4v",
	"mov",
	"mp4",
	"mpg",
	"rm",
	"srt",
	"swf",
	"vob",
	"wmv",
	"doc",
	"docx",
	"ebook",
	"odt",
	"org",
	"pages",
	"pdf",
	"rtf",
	"rst",
	"tex",
	"wpd",
	"wps",
	"dat",
	"ged",
	"pps",
	"ppt",
	"pptx",
	"sdf",
	"tar",
	"tax2016",
	"tax2019",
	"xml",
	"aif",
	"iff",
	"m3u",
	"m4a",
	"mid",
	"mp3",
	"mpa",
	"wav",
	"wma",
	"3g2",
	"3gp",
	"asf",
	"asx",
	"avi",
	"flv",
	"m4v",
	"mov",
	"mp4",
	"mpg",
	"rm",
	"srt",
	"swf",
	"vob",
	"wmv",
];

export const Editor = () => {
	const editorRef = useRef<editor.IStandaloneCodeEditor | undefined>(undefined);
	const [fileName, _] = useState(location.hash.slice(1));
	const fileValue = useRef<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const f = async () => {
			const content = await loadFile(fileName);
			fileValue.current = content;
			setLoading(false);
		};
		if (fileName && loading) f();
	}, [fileName, loading]);

	const onSave = () => {
		const value = editorRef.current?.getValue();
		if (value) {
			saveFile(fileName, value);
		}
	};

	const onMount: OnMount = (editor, monaco) => {
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
				Uri.file(fileName),
			),
		);

		editorRef.current = editor;
		emmetHTML(monaco);
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

	if (!fileName) return <div>Missing file path.</div>;

	if (disabledFileTypes.includes(fileName.split(".").pop() || ""))
		return <div>File type not supported.</div>;

	return (
		<div className={styles.root}>
			<nav>
				<button
					type="button"
					onClick={() => {
						window.parent.postMessage({ type: "goBack" }, "*");
					}}
				>
					<ArrowLeft size={17} />
					back
				</button>
				<h2>
					{`home/${user}${fileName}`.split("/").map((part, i) => [
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
				{!loading && (
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
