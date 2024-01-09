import useWebSocket from "react-use-websocket";
import styles from "./chat.module.css";
import { useState } from "react";
import { request, type ChatResponse } from "./chat-types";
import { getUser } from "../../utils/auth";
import isUrlHttp from "is-url-http";

const roles: Record<string, string> = {
	henry: "admin",
	guest: "guest",
};

export const Chat = () => {
	const { messages, sendMessage } = useChat();

	const messagesByDay: [string, Message[]][] = messages.reduce(
		(acc, msg) => {
			const date = Intl.DateTimeFormat("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
			}).format(new Date(msg.time));

			const day = acc.find((d) => d[0] === date);
			if (day) {
				day[1].push(msg);
			} else {
				acc.push([date, [msg]]);
			}

			return acc;
		},
		[] as [string, Message[]][],
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
				<div className={styles.users}>
					<h2>Users</h2>
				</div>
			</aside>
			<section className={styles.main}>
				<h2>Messages</h2>
				<div className={styles.messages}>
					{messagesByDay.map(([date, msgs], i) => (
						<div key={`${date}-${i}`}>
							<div className={styles.date}>{date}</div>
							{msgs.map((msg, i) => (
								<ChatMessage message={msg} key={`${msg.time}-${i}`} />
							))}
						</div>
					))}
				</div>
				<form
					id="chat-form"
					onSubmit={(e) => {
						e.preventDefault();
						const form = e.target as HTMLFormElement;
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

const ChatMessage = ({ message }: { message: Message }) => {
	let role = roles?.[message.user] || "user";
	if (message.user.startsWith("guest")) role = "guest";
	const me = message.user === getUser();

	return (
		<div key={message.time}>
			{message.user === "system" ? null : (
				<div className={styles.username} data-role={role} data-me={me}>
					{message.user}
				</div>
			)}

			<div className={styles.message}>
				{message.message.split(" ").map((line, i) => {
					let formattedMessage: JSX.Element | undefined = undefined;
					if (isUrlHttp(line))
						formattedMessage = (
							<a
								href={line}
								target="_blank"
								rel="noopener noreferrer"
								key={`link-${i}`}
							>
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
				}).format(new Date(message.time))}
			</div>
		</div>
	);
};

const socketUrl = `${window.location.protocol === "https:" ? "wss" : "ws"}://${
	window.location.host
}/api/chat`;

const useChat = () => {
	const [rooms, setRooms] = useState<string[]>([]);
	const [currentRoom, setCurrentRoom] = useState<string | undefined>(undefined);
	const [messages, setMessages] = useState<Message[]>([]);

	const addMessage = (
		username: string,
		message: string,
		room: string,
		time: number,
	) => {
		if (room !== currentRoom) return;
		setMessages((prev) => [
			...prev,
			{
				room,
				user: username,
				message,
				time,
			},
		]);
	};

	const handleWsMessage = (event: MessageEvent) => {
		let msg: ChatResponse;
		try {
			msg = JSON.parse(event.data);
		} catch (e) {
			return;
		}

		if (msg.type === "message") {
			addMessage(msg.username, msg.message, msg.room, msg.time);
			return;
		}
		if (msg.type === "info") {
			console.log("info", msg, currentRoom);
			setRooms(msg.publicRooms || []);
			if (!currentRoom) setCurrentRoom(msg.defaultRoom);
			return;
		}

		console.log(msg);
	};

	const ws = useWebSocket(socketUrl, {
		onMessage: handleWsMessage,
		shouldReconnect: (closeEvent) => true,
	});

	const sendMessage = (message: string) => {
		console.log(
			request({ type: "message", message, room: currentRoom as string }),
		);

		ws.sendMessage(
			request({ type: "message", message, room: currentRoom as string }),
		);
	};

	return {
		rooms,
		currentRoom,
		messages,
		sendMessage,
		changeRoom: (room: string) => {},
	};
};

type Message = {
	room: string;
	user: string;
	message: string;
	time: number;
};
