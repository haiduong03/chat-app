
const messages = document.getElementById("messages");
const socket = io("http://localhost:80", {
	transports: ["websocket", "polling", "flashsocket"],

});
const name = (Math.random() + 1).toString(36).substring(7);
// socket.emit("connection", { name });

const createRoom = () => {
	const room = document.getElementById("room").value.toString();
	socket.emit("create-room", room);
};

const joinRoom = () => {
	const room = document.getElementById("room").value.toString();
	socket.emit("join-room", room);
};

const handleSubmitNewMessage = async () => {
	const date = new Date();
	const h = date.getHours();
	const m = date.getMinutes();
	const time = h + ":" + m;
	const text = document.getElementById("text").value.toString();
	const room = document.getElementById("room").value.toString();
	if (text.length > 0) {
		await socket.emit("send", {
			sender: name,
			message: text,
			time: time,
			to: room,
		});
	}
};

socket.on("joined-room", async (data) => { console.log({ data: data }) });
socket.on("receive", async (data) => { console.log({ data: data }) });
socket.on("created-room", async (data) => { console.log({ data: data }) });

