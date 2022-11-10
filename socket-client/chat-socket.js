const person = prompt("Please enter your name");

const socket = io("http://localhost:3000", {
	transports: ["websocket", "polling", "flashsocket"],
});

const messages = document.getElementById("messages");

const handleSubmitNewMessage = () => {
	const text = document.getElementById("message").value;
	socket.emit("messageToServer", { sender: person, message: text });
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

// const handleNewMessage = (message) => {
// 	messages.appendChild(buildNewMessage(message));
// };

// const buildNewMessage = (message) => {
// 	const li = document.createElement("li");
// 	li.appendChild(
// 		document.createTextNode(message),
// 		// (document.getElementById("person").innerHTML = person),
// 	);
// 	return li;
// };
