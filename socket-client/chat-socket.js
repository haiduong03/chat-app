const person = prompt("Please enter your name");
document.getElementById("name").innerHTML = person;
const messages = document.getElementById("messages");
const socket = io("http://localhost:81", {
	transports: ["websocket", "polling", "flashsocket"],
});

//Room

// async function createRoom() {
// 	const Room = document.getElementById("room").value;
// 	await socket.emit("createRoom", Room);
// }

// async function joinRoom() {
// 	const Room = document.getElementById("room").value;
// 	await socket.emit("joinRoom", { room: Room });
// }

// async function leftRoom() {
// 	const Room = document.getElementById("room").value;
// 	await socket.emit("leaveRoom", { room: Room });
// }

// socket.on("listRoom", async (room) => {
// return (document.getElementById("listRoom").innerHTML = room);
// console.log(room);
// });

// const scrollToBottom = (id) => {

// element.scrollInToView = element.scrollIntoView(false);
// };

// const selectFile = (file) => {
// const file = document.getElementById("file").files[0];
// document.getElementById("text").value = file.name;
// .createTextNode(file.name);
// console.log(file);
// socket.emit("sendFile", file[0], (status) => console.log(status));
// img.onchange = (evt) => {
// const [file] = img.files;
// if (file) {
// 	blah.src = URL.createObjectURL(file);
// 	const blob = new Blob([blah.src], { type: "image/svg+xml" });
// 	console.log(blob);
// }
// };

// var img = document.getElementById("blah");

// var reader = new FileReader();
// reader.onload = function (e) {
// 	img.src = e.target.result;
// 	socket.emit("img", { base64: e.target.result });
// };
// reader.readAsDataURL(selector.files[0]);
// // }
// // console.log(file[0]);
// // };
// const a = document.getElementById("img");
// a.onchange = submitImg();
// // .addEventListener("change", () => {
// // 	submitImg();
// // });

// function submitImg() {
// 	var selector = a;
// 	var img = document.getElementById("blah");

// 	var reader = new FileReader();
// 	reader.onload = function (e) {
// 		img.src = e.target.result;
// 		socket.emit("img", { base64: e.target.result });
// 	};
// 	reader.readAsDataURL(selector.files[0]);
// }

// const img = document.getElementById("img");
// const blob = new Blob([img], { type: "img/*" });

// const reader = new FileReader();
// reader.onload = (e) => {
// 	img.src = e.target.result;
// 	socket.emit("img", { base64: e.target.result });
// };
// reader.readAsDataURL(blob);

// console.log(reader);
// socket.on("connected", async());

const createRoom = () => {
	const room = document.getElementById("room").value.toString();
	socket.emit("createRoom", { room });
};

const joinRoom = () => {
	const room = document.getElementById("room").value.toString();
	socket.emit("joinRoom", { room });
};
const listRoom = () => {
	socket.on("listDoom");
};
const handleSubmitNewMessage = async () => {
	// const Room = document.getElementById("room").value;

	const date = new Date();
	const h = date.getHours();
	const m = date.getMinutes();
	const time = h + ":" + m;
	const text = document.getElementById("text").value.toString();
	const room = document.getElementById("room").value.toString();

	// const file = document.getElementById("file");
	if (text.length > 0) {
		await socket.emit("messageToServer", {
			sender: person,
			room: room,
			// 		file: file,
			message: text,
			time: time,
		});
	}
};

socket.on("messageToClient", async (data) => {
	const human = document.createElement("h3");
	const setName = document.createTextNode(data.sender);
	human.appendChild(setName);

	const text = document.createElement("li");
	const setText = document.createTextNode(data.message);
	text.appendChild(setText);

	const time = document.createElement("sup");
	const setTime = document.createTextNode(data.time);
	time.appendChild(setTime);

	const a = document.createElement("ul");
	a.appendChild(human);
	a.appendChild(text);
	a.appendChild(time);

	const b = document.getElementById("messages");
	b.appendChild(a);
	b.scrollIntoView(false);
	b.scrollTop = b.scrollHeight;
});

// socket.on("connected", async (data) => {
// 	console.log(data);
// });
// function imageUploaded() {
// document.addEventListener("change", () => {
// 	const file = document.getElementById("file");
// 	const fileList = event.target.files;
// 	console.log(fileList);
// });
// socket.emit("img", file.files[0], (status) => {
// 	console.log(status);
// });
// }
