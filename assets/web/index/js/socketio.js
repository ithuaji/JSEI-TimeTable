let socket;
	const logs = document.getElementById('logs');
	let isBatchRequest = false; // 标志当前是否是批量请求
	let currentWeek = 0;

	// 自动连接服务器
	socket = io('ws://106.14.181.81:2345'); // 替换为你的服务器地址

	socket.on('connect', () => {
		console.log("已连接到服务器");
		document.getElementById("StateOfServer").textContent = "已🔗到服务器";
	});

socket.on('data-response', (response) => {
	// 检查是否是批量请求
	if (isBatchRequest) {
		const weekKey = `week_${currentWeek}`;
		if (response.tag === `week_${currentWeek}`) {
			// 仅存储 response.data 部分
			localStorage.setItem(weekKey, JSON.stringify(response.data));
			console.log(`第 ${currentWeek} 周数据已储存到 LocalStorage`);
			document.querySelector("#LoadingTextview").textContent = `第 ${currentWeek} 周数据已储存到 LocalStorage`;
			processNextWeek();
		} else {
			console.warn(`标签不匹配，期望: week_${currentWeek}, 实际: ${response.tag}`);
		}
	}
});

	socket.on('error', (error) => {
		console.log('收到错误: ' + JSON.stringify(error));
		alert(`收到错误:`+ JSON.stringify(error));
		if(JSON.stringify(error)===`{"error":"Invalid account or password"}`){
			alert(`账号或密码错误，请重新输入`);
		//	localStorage.removeItem("username");
		//	localStorage.removeItem("password");

		}
		if (isBatchRequest) {
			processNextWeek(); // 即使出错也不中断流程
		}
	});

	socket.on('disconnect', () => {
		console.log('已与服务器断开连接');
		document.getElementById("StateOfServer").textContent = "已与服务器断开连接";
	});

	function processNextWeek() {
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		currentWeek++;

		if (currentWeek > 20) {
			console.log('所有周数据请求完成');
			document.getElementById("LoadingTextview").textContent = '所有周数据请求完成';
			isBatchRequest = false;
			hideLoadingContainer();
			document.getElementById("IndexInputBtn").click();
			return;
		}

		const payload = {
			username: username,
			password: password,
			weekNumber: currentWeek,
			tag: `week_${currentWeek}`
		};

		console.log(`发送第 ${currentWeek} 周的数据请求: ` + JSON.stringify(payload));
		document.querySelector("#LoadingTextview").textContent = `新用户，正在预存（第 ${currentWeek}/20 周）的数据`;
		document.getElementById('sendDataBtn').style.display = 'none';
		socket.emit('get-data', payload);
	}

	document.getElementById('sendDataBtn').addEventListener('click', () => {
		if (socket && socket.connected) {
			isBatchRequest = true;
			currentWeek = 0;
			processNextWeek();
		} else {
			console.log('尚未连接到服务器');
			document.querySelector("#LoadingTextview").textContent = '尚未连接到服务器,检查你的网络设置，并且刷新页面';
		}
	});

	document.getElementById('disconnectBtn').addEventListener('click', () => {
		if (socket) {
			socket.disconnect();
			console.log('已请求断开连接');
			document.getElementById("StateOfServer").textContent = "已与服务器断开连接";
		} else {
			console.log('尚未连接到服务器');
			document.getElementById("StateOfServer").textContent = "你就没🔗到服务器";
		}
	});

	document.getElementById('viewLocalStorageBtn').addEventListener('click', () => {
		console.log('LocalStorage 中的存储内容:');
		for (let i = 1; i <= 20; i++) {
			const key = `week_${i}`;
			const value = localStorage.getItem(key);
			console.log(`${key}: ${value}`);
		}
	});