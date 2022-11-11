const Person = prompt("Please enter your name");
const Room = parseInt([document.getElementById("room").value]);
const messages = document.getElementById("messages");

const socket = io("http://localhost:3000", {
	transports: ["websocket", "polling", "flashsocket"],
});

function joinRoom() {
	socket.emit("joinRoom", { room: Room });
}

function leftRoom() {
	socket.emit("leaveRoom", { room: Room });
}

const handleSubmitNewMessage = () => {
	const Text = document.getElementById("message").value;
	socket.emit("messageToRoom", {
		sender: Person,
		room: Room,
		message: Text,
	});
};

socket.on("messageToClient", (data) => {
	const human = document.createElement("p");
	const humanName = document.createTextNode(data.sender);
	human.appendChild(humanName);

	const text = document.createElement("li");
	const textValue = document.createTextNode(data.message);
	text.appendChild(textValue);

	const a = document.getElementById("human");
	a.appendChild(human);
	a.appendChild(text);
});

const handleNewMessage = (message) => {
	messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
	const li = document.createElement("li");
	li.appendChild(
		document.createTextNode(message),
		// (document.getElementById("person").innerHTML = person),
	);
	return li;
};
