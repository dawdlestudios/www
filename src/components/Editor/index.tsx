import React, { Suspense } from "react";
import { Editor as _Editor } from "./editor";
import { loader } from "@monaco-editor/react";

const Lazy = React.lazy(async () => {
	await initMonaco();
	return {
		default: _Editor,
	};
});

export const Editor = () => {
	return (
		<Suspense>
			<Lazy />
		</Suspense>
	);
};

export const initMonaco = async () => {
	if (typeof window !== "undefined") {
		const { cssWorker, editorWorker, htmlWorker, jsonWorker, tsWorker, monaco } = await import(
			"./monaco"
		);
		self.MonacoEnvironment = {
			getWorker(_, label) {
				if (label === "json") {
					return new jsonWorker();
				}
				if (label === "css" || label === "scss" || label === "less") {
					return new cssWorker();
				}
				if (label === "html" || label === "handlebars" || label === "razor") {
					return new htmlWorker();
				}
				if (label === "typescript" || label === "javascript") {
					return new tsWorker();
				}
				return new editorWorker();
			},
		};

		loader.config({ monaco });
		loader.init();
	}
};
