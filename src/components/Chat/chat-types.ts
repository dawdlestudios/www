export type ChatRequest =
	| {
			type: "message";
			room: string;
			message: string;
	  }
	| {
			type: "join";
			room: string;
	  };

export const request = (req: ChatRequest) => JSON.stringify(req);

export type ChatResponse =
	| {
			type: "message";
			room: string;
			message: string;
			username: string;
			time: number;
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
