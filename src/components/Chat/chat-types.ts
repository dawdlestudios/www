export type ChatRequest =
	| {
			type: "message";
			message: string;
			room: string;
	  }
	| {
			type: "join";
			room: string;
	  };

export type ChatMessage = {
	room: string;
	username: string;
	message: string;
	time: number;
};

export const request = (req: ChatRequest) => JSON.stringify(req);

export type ChatResponse =
	| ({
			type: "message";
	  } & ChatMessage)
	| {
			type: "roomHistory";
			room: string;
			history: ChatMessage[];
	  }
	| {
			type: "info";
			defaultRoom: string;
			privateRooms: string[] | null;
			publicRooms: string[] | null;
	  }
	| {
			type: "error";
			message: string;
	  };
