import isUrlHttp from "is-url-http";
import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getUser } from "../../utils/auth";
import { type ChatMessage, type ChatResponse, request } from "./chat-types";
import styles from "./chat.module.css";

const roles: Record<string, string> = {
	henry: "admin",
	guest: "guest",
};

export const Chat = () => {
	const { messages, sendMessage, error, currentRoom } = useChat();

	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		setLoaded(true);
	}, []);

	const messagesByDay: [string, ChatMessage[]][] = messages.reduce(
		(acc, msg) => {
			const date = Intl.DateTimeFormat("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
			}).format(new Date(msg.time * 1000));

			const day = acc.find((d) => d[0] === date);
			if (day) {
				day[1].push(msg);
			} else {
				acc.push([date, [msg]]);
			}

			return acc;
		},
		[] as [string, ChatMessage[]][],
	);

	return (
		<div className={styles.chat}>
			<aside className={styles.sidebar}>
				<div className={styles.rooms}>
					<h2>Rooms</h2>
					<ul>
						<li data-active="true">#general</li>
					</ul>
				</div>
				{/* Reenable once we actually show users */}
				{/* <div className={styles.users}>
					<h2>Users</h2>
				</div> */}
			</aside>
			<section className={styles.main}>
				<h2>Messages</h2>
				<div className={styles.messages}>
					{loaded && !error && currentRoom && (
						<div className={styles.room}>Connected to #{currentRoom}</div>
					)}
					{loaded &&
						messagesByDay.map(([date, msgs], i) => (
							<div key={`${date}-${i}`}>
								<div className={styles.date}>{date}</div>
								{msgs.map((msg, i) => (
									<ChatMessageComp message={msg} key={`${msg.time}-${i}`} />
								))}
							</div>
						))}
					{loaded && error && (
						<div className={styles.error} data-connecting={error === "connecting..." && "true"}>
							{error}
						</div>
					)}
				</div>
				<form
					id="chat-form"
					onSubmit={(e) => {
						e.preventDefault();
						const form = e.currentTarget;
						sendMessage(new FormData(form).get("msg") as string);
						form.reset();
					}}
				>
					<input name="msg" type="text" />
					<button type="submit">Send</button>
				</form>
			</section>
		</div>
	);
};

const ChatMessageComp = ({ message }: { message: ChatMessage }) => {
	let role = roles?.[message.username] || "user";
	if (message.username.startsWith("guest")) role = "guest";
	const me = message.username === getUser();

	return (
		<div key={message.time}>
			{message.username === "system" ? null : (
				<div className={styles.username} data-role={role} data-me={me}>
					{message.username}
				</div>
			)}

			<div className={styles.message}>
				{message.message.split(" ").map((line, i) => {
					let formattedMessage: JSX.Element | undefined = undefined;
					if (isUrlHttp(line))
						formattedMessage = (
							<a href={line} target="_blank" rel="noopener noreferrer" key={`link-${i}`}>
								{line}
							</a>
						);

					if (line.startsWith("@"))
						formattedMessage = (
							<span className={styles.mention} key={`mention-${i}`}>
								{line}
							</span>
						);

					if (line.startsWith("#"))
						formattedMessage = (
							<span className={styles.channel} key={`channel-${i}`}>
								{line}
							</span>
						);

					if (formattedMessage) return <>{formattedMessage} </>;
					return `${line} `;
				})}
			</div>
			<div className={styles.time}>
				{Intl.DateTimeFormat("en-US", {
					hour: "numeric",
					minute: "numeric",
				}).format(new Date(message.time * 1000))}
			</div>
		</div>
	);
};

const socketUrl = () =>
	`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/chat`;

const useChat = () => {
	if (typeof window === "undefined") {
		return {
			error: "connecting...",
			rooms: [],
			currentRoom: undefined,
			messages: [],
			sendMessage: () => {},
			changeRoom: () => {},
		};
	}

	const [rooms, setRooms] = useState<string[]>([]);
	const [currentRoom, setCurrentRoom] = useState<string | undefined>(undefined);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [error, setError] = useState<string | undefined>("connecting...");

	const addMessage = (username: string, message: string, room: string, time: number) => {
		if (room !== currentRoom) return;
		setMessages((prev) => [
			...prev,
			{
				room,
				username,
				message,
				time,
			},
		]);
	};

	const handleWsMessage = useCallback(
		(event: MessageEvent) => {
			let msg: ChatResponse;
			try {
				msg = JSON.parse(event.data);
			} catch (e) {
				return;
			}

			if (msg.type === "message") {
				console.log("message", msg);
				const { username, message, room, time } = msg;
				addMessage(username, message, room, time);
				return;
			}
			if (msg.type === "info") {
				console.log("info", msg, currentRoom);
				setRooms(msg.publicRooms || []);
				if (!currentRoom) setCurrentRoom(msg.defaultRoom);
				return;
			}
			if (msg.type === "roomHistory") {
				console.log("roomHistory", msg, currentRoom);
				if (!currentRoom || msg.room === currentRoom) setMessages(msg.history);
				return;
			}
			if (msg.type === "error") {
				console.error("error", msg);
				return;
			}

			console.log("unknown message", msg);
		},
		[currentRoom, addMessage],
	);

	const ws = useWebSocket(socketUrl(), {
		onMessage: handleWsMessage,
		shouldReconnect: () => true,
		onError: (e) => {
			console.error(e);
			setError("error, reconnecting...");
		},
		onClose: (e) => {
			console.log(e);
			setError("disconnected, reconnecting...");
		},
		onOpen: (e) => {
			console.log(e);
			setError(undefined);
		},
		onReconnectStop: (e) => {
			console.log(e);
			setError(`failed to reconnect after ${e} attempts`);
		},
	});

	const sendMessage = (message: string) => {
		ws.sendMessage(request({ type: "message", message, room: currentRoom as string }));
	};

	return {
		error,
		rooms,
		currentRoom,
		messages,
		sendMessage,
		changeRoom: () => {},
	};
};
