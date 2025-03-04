let dayName = "未知星期";
let WeekName = 0
let ToWeek = 0
let data_n

let rgb_R = 0
let rgb_G = 0
let rgb_B = 0
/*
const todayn = new Date();
const weekdaysn = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const dayOfWeekn = today.getDay();
//console.log(dayOfWeekn); */


const scheduleTimeDate = [{
		"jcmc": "1",
		"qssj": "08:30",
		"jssj": "09:15"
	},
	{
		"jcmc": "2",
		"qssj": "09:20",
		"jssj": "10:05"
	},
	{
		"jcmc": "3",
		"qssj": "10:20",
		"jssj": "11:05"
	},
	{
		"jcmc": "4",
		"qssj": "11:10",
		"jssj": "11:55"
	},
	{
		"jcmc": "5",
		"qssj": "14:00",
		"jssj": "14:45"
	},
	{
		"jcmc": "6",
		"qssj": "14:50",
		"jssj": "15:35"
	},
	{
		"jcmc": "7",
		"qssj": "15:50",
		"jssj": "16:35"
	},
	{
		"jcmc": "8",
		"qssj": "16:40",
		"jssj": "17:25"
	},
	{
		"jcmc": "9",
		"qssj": "17:30",
		"jssj": "18:15"
	},
	{
		"jcmc": "10",
		"qssj": "19:00",
		"jssj": "19:45"
	},
	{
		"jcmc": "11",
		"qssj": "19:55",
		"jssj": "20:40"
	}
];

window.onload = function() {
	// 页面加载时不要自动触发登录请求
	document.getElementById('loadingContainer').style.display = 'none';
	document.getElementById('sendDataBtn').style.display = 'none';
	document.getElementById('connectBtn').style.display = 'none';
	document.getElementById('disconnectBtn').style.display = 'none';
	document.getElementById('viewLocalStorageBtn').style.display = 'none';
	document.getElementById('requestSpecificWeekBtn').style.display = 'none';
	document.getElementById('weekNumberInput').style.display = 'none';
	document.getElementById('ReSendRequestWeekCourseBtn').style.display = 'none';


	// 如果记住我功能已启用，填充表单
	if (localStorage.getItem("rememberMe") === "true") {
		document.getElementById("username").value = localStorage.getItem("username") || '';
		document.getElementById("password").value = localStorage.getItem("password") || '';
		document.getElementById("rememberMe").checked = true;
		//在表单填充的情况下自动登录
		sendLoginRequest()
	}


};


document.addEventListener("visibilitychange", function() {
	if (document.hidden) {
		console.log("网页已进入后台或不可见");
		// 在这里可以处理页面进入后台时的逻辑
	} else {
		console.log("网页可见");
		// 在这里可以处理页面变为可见时的逻辑
	}
});







function getRandomRGBA(afloat) {
	// 随机生成 RGBA 颜色
	const r = Math.floor(Math.random() * 256); // 红色（0-255）
	const g = Math.floor(Math.random() * 256); // 绿色（0-255）
	const b = Math.floor(Math.random() * 256); // 蓝色（0-255）
	//const a = (Math.random()).toFixed(2); // 透明度（0.00 - 1.00）
	const a = afloat
	rgb_R = r
	rgb_G = g
	rgb_B = b


	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function getRandomRGBA_body() {
	// 随机生成 RGBA 颜色
	const r = Math.floor(Math.random() * 256); // 红色（0-255）
	const g = Math.floor(Math.random() * 256); // 绿色（0-255）
	const b = Math.floor(Math.random() * 256); // 蓝色（0-255）
	//const a = (Math.random()).toFixed(2); // 透明度（0.00 - 1.00）
	const a = 0.1
	rgb_R = r
	rgb_G = g
	rgb_B = b


	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function setRandomBackgroundColor(Objectbox) {
	const div = document.getElementById(Objectbox);
	div.style.backgroundColor = getRandomRGBA(0.1);
}

function setRandomBackgroundColor_body(Objectbox) {
	const div = document.getElementById(Objectbox);
	div.style.backgroundColor = getRandomRGBA_body();
	//document.body.style.backgroundColor = getRandomRGBA();
	//	const div = document.getElementById("getRandomRGBA_body");
	//	div.style.backgroundColor = getRandomRGBA_body();

}

// 页面加载时随机改变背景颜色
//setRandomBackgroundColor_body();
setRandomBackgroundColor_body("header")

function VablePassword() {
	const passwordField = document.getElementById('password');
	const toggleButton = document.getElementById('toggle-password');
	if (passwordField.type === "password") {
		passwordField.type = "text"; // 显示密码
		//toggleButton.textContent = "隐藏"; // 修改按钮文本
	} else {
		passwordField.type = "password"; // 隐藏密码
		//toggleButton.textContent = "显示"; // 修改按钮文本
	}
}


//保存用户信息到本地
function saveUserInfoToLocalStorage(username, password, rememberMe) {
	if (rememberMe) {
		localStorage.setItem("username", username);
		localStorage.setItem("password", password);
		localStorage.setItem("rememberMe", "true");
	} else {
		localStorage.removeItem("username");
		localStorage.removeItem("password");
		localStorage.setItem("rememberMe", "false");
	}
}
//等待中动画
function updateUIForLoading() {
	document.getElementById('loadingContainer').style.display = 'flex';
}

function updateUIForResponse(responseContainer, responseData, json_data) {
	responseContainer.style.display = 'block';
	displayFormattedData(json_data);
}

function updateUIForResponse_OtherWeek(responseContainer, responseData, json_data) {
	responseContainer.style.display = 'block';
	displayFormattedData_OtherWeek(json_data);
}

function handleRequestError(responseContainer, responseData, error) {
	responseContainer.style.display = 'block';
	responseData.textContent = '请求出错: ' + error.message;

	// 尝试显示缓存数据
	const cachedData = localStorage.getItem("lastSuccessfulData");
	if (cachedData) {
		displayFormattedData(JSON.parse(cachedData), true); // 传入缓存数据并标记为缓存
	}
}
//隐藏加载容器
function hideLoadingContainer() {
	document.getElementById('loadingContainer').style.display = 'none';
}
//计算周数

function calculateWeekNumber(targetDateStr) {
	const startDate = new Date(2025, 1, 17); // 2月17日（JavaScript的月份从0开始，所以1代表2月）
	const targetDate = new Date(targetDateStr);
	const delta = targetDate - startDate;
	const weekNumber = Math.floor(delta / (1000 * 60 * 60 * 24 * 7)) + 1;
	return weekNumber;

}


function getCurrentWeekday() {
	const today = new Date();
	const weekdays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	const dayOfWeek = today.getDay(); // 0-6, 0代表星期天
	return weekdays[dayOfWeek];
}


console.log(getCurrentWeekday());

// 提取获取周数的功能
function getCurrentWeekNumber() {
	const today = new Date();
	console.log(today);
	const dateStr = today.toISOString().split('T')[0];
	//const weekdaya = getCurrentWeekday(); // 获取星期几
	//console.log(`今天是：${weekdaya}`);
	//格式示例Fri Nov 29 2024 16:31:24 GMT+0800 (中国标准时间)
	console.log("##############");
	const weekdaya = getCurrentWeekday(); // 获取星期几
	console.log(`今天是：${weekdaya}`);
	console.log("##############");

	//const dateStr = today.toISOString().split('T')[0];
	return calculateWeekNumber(dateStr); // 已经定义了计算周数的函数
}
/*

// 提取请求发送和处理逻辑（已经废弃）
// 提取请求发送和处理逻辑（已经废弃）
// 提取请求发送和处理逻辑（已经废弃）
// 提取请求发送和处理逻辑（已经废弃）
// 提取请求发送和处理逻辑（已经废弃）
// 提取请求发送和处理逻辑（已经废弃）
async function fetchDataFromServer(username, password, weekNumber, retries) {
	const response = await fetch('http://106.14.181.81:3001/get-data', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password,
			weekNumber
		})
	});
	// 提取请求发送和处理逻辑（已经废弃）

	if (response.status === 503 && retries < 10) {
		return retryRequest(retries);
	}

	if (!response.ok) {
		throw new Error('请求失败，状态码: ' + response.status);
	}

// 提取请求发送和处理逻辑（已经废弃）

	//#	const cachedData = localStorage.getItem("lastSuccessfulData");
	//	if (cachedData) {
	//		displayFormattedData(JSON.parse(cachedData), true); // 传入缓存数据并标记为缓存
	//	}
	//#	return cachedData;

// 提取请求发送和处理逻辑（已经废弃）


	return response.json();
}
// 提取请求发送和处理逻辑（已经废弃）
// 提取请求发送和处理逻辑（已经废弃）
// 提取请求发送和处理逻辑（已经废弃）
// 提取请求发送和处理逻辑（已经废弃）

*/

// 重试请求的功能
function retryRequest(retries) {
	document.getElementById('loadingContainer').querySelector('span').textContent = '服务器繁忙，请耐心等待！';
	return new Promise(resolve => setTimeout(() => resolve(sendLoginRequest(retries + 1)), 2000));
}

// 主函数：发起登录请求（已经废弃）
// 主函数：发起登录请求（已经废弃）
// 主函数：发起登录请求（已经废弃）
// 主函数：发起登录请求（已经废弃）
// 主函数：发起登录请求（已经废弃）
// 主函数：发起登录请求（已经废弃）
// 主函数：发起登录请求（已经废弃）
/*
async function jUNK_sendLoginRequest(retries = 0) {
	//从文本框获取内容
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const rememberMe = document.getElementById('rememberMe').checked;
	const responseContainer = document.getElementById('responseContainer');
	const responseData = document.getElementById('responseData');

// 主函数：发起登录请求（已经废弃）
// 主函数：发起登录请求（已经废弃）
// 主函数：发起登录请求（已经废弃）


	if (!username || !password) {
		alert("请输入用户名和密码！");
		return;
	}
// 主函数：发起登录请求（已经废弃）
	// 保存用户信息和更新UI
	saveUserInfoToLocalStorage(username, password, rememberMe);
	updateUIForLoading();
// 主函数：发起登录请求（已经废弃）
	try {
		// 获取当前周数
		const weekNumber = getCurrentWeekNumber();
		WeekName = weekNumber
		ToWeek = weekNumber
		// 请求数据并处理返回
		const json_data = await fetchDataFromServer(username, password, weekNumber, retries);
// 主函数：发起登录请求（已经废弃）
		displayUserInfo(username, password); // 显示用户信息
		hideLoginContainer(); // 隐藏登录容器
		updateUIForResponse(responseContainer, responseData, json_data); // 更新UI以显示数据
// 主函数：发起登录请求（已经废弃）
		// 保存数据到 localStorage
		localStorage.setItem("lastSuccessfulData", JSON.stringify(json_data));
	} catch (error) {
		handleRequestError(responseContainer, responseData, error);
	} finally {
		hideLoadingContainer();
	}
	// 主函数：发起登录请求（已经废弃）
}
*/

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// 登录请求
function sendLoginRequest() {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const rememberMe = document.getElementById('rememberMe').checked;
	//	saveUserInfoToLocalStorage(username, password, rememberMe);
	if (!username || !password) {
		alert("请输入用户名和密码！");
		return;
	}

	// logMessage("正在请求登录...");
	console.log("正在请求登录...");


	const userExists = localStorage.getItem("username") === username;
	if (!userExists) {
		NewUserLogin(username, password, rememberMe);

	} else {
		ReturningUserLogin();
	}
}




// 新用户登录逻辑
function NewUserLogin(username, password, rememberMe) {
	document.getElementById('sendDataBtn').style.display = 'flex';
	updateUIForLoading();
	saveUserInfoToLocalStorage(username, password, rememberMe);
	document.getElementById("sendDataBtn").click();
	document.querySelector("#LoadingTextview").textContent = `新用户，即将开始预存学期课表`;

	//	ReturningUserLogin();



}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////



async function ReturningUserLogin(retries = 0) {
	try {
		const currentWeek = getCurrentWeekNumber();
		//const currentWeek = 2;
		//217
		WeekName = currentWeek
		ToWeek = currentWeek
		const weekKey = `week_${currentWeek}`;
		const weekData = localStorage.getItem(weekKey);
		///217
		console.log(`从 LocalStorage 获取到第 ${currentWeek} 周数据${weekData}内容`);

		if (weekData) {
			console.log(`n从 LocalStorage 获取到第 ${currentWeek} 周数据`);
			const jsonData = JSON.parse(weekData);
			console.log(`转换到 JSON 数据${jsonData}内容`);



			// 显示课表数据
			hideLoginContainer();
			displayFormattedData(jsonData);
			document.getElementById('responseContainer').style.display = 'block';

			// 调用从服务器获取数据的函数
			fetchWeekDataFromServer(currentWeek, jsonData);
		} else {
			console.log(`LocalStorage 中未找到第 ${currentWeek} 周数据`);
			alert(`未找到本周数据，请确保数据已预存。`);
		}
	} catch (error) {
		console.error("ReturningUserLogin 发生错误:", error);
		if (retries < 3) {
			console.log(`重试第 ${retries + 1} 次...`);
			ReturningUserLogin(retries + 1);
		} else {
			alert("加载失败，请检查网络连接或重新登录。");
		}
	}
}
/**
 * 向服务器获取指定周的数据
 * @param {number} weekNumber - 当前显示的周数
 * @param {object} localData - 本地存储的 JSON 数据
 */
function fetchWeekDataFromServer(weekNumber, localData) {
	console.log(`开始请求服务器第 ${weekNumber} 周的数据...`);

	const username = localStorage.getItem("username");
	const password = localStorage.getItem("password");

	if (!username || !password) {
		console.warn("用户名或密码缺失，无法请求数据更新。");
		return;
	}

	// 生成请求标签
	const requestTag = `week_${weekNumber}`;

	const payload = {
		username: username,
		password: password,
		weekNumber: weekNumber,
		tag: requestTag, // 添加标签
	};

	// 发送请求
	socket.emit('get-data', payload);

	// 监听服务器返回的数据
	socket.once('data-response', (serverResponse) => {
		const {
			tag,
			data: serverData
		} = serverResponse;

		// 检查返回的数据标签是否匹配当前周
		if (tag !== requestTag) {
			console.warn(`忽略标签为 ${tag} 的响应，当前请求标签为 ${requestTag}`);
			return;
		}

		console.log(`收到服务器返回的第 ${weekNumber} 周数据`);
		compareAndUpdateLocalStorage(weekNumber, localData, serverData);
	});

	// 错误处理
	socket.once('error', (error) => {
		console.error(`获取第 ${weekNumber} 周数据时发生错误:`, error);
	});
}

/**
 * 比较服务器数据和本地数据并更新 LocalStorage
 * @param {number} weekNumber - 当前显示的周数
 * @param {object} localData - 本地存储的 JSON 数据
 * @param {object} serverData - 从服务器返回的 JSON 数据
 */
function compareAndUpdateLocalStorage(weekNumber, localData, serverData) {
	console.log(`开始比较第 ${weekNumber} 周的数据...`);

	const serverDataString = JSON.stringify(serverData);
	const localDataString = JSON.stringify(localData);

	if (serverDataString === localDataString) {
		console.log(`第 ${weekNumber} 周的数据无更新`);
	} else {
		console.log(`第 ${weekNumber} 周的数据已更新，替换 LocalStorage 内容`);
		localStorage.setItem(`week_${weekNumber}`, serverDataString);
		alert(`第 ${weekNumber} 周的教务课表有更新！即将刷新页面自动同步！`);
		//location.reload();
		ReSendRequestWeekCourse();
	}
}
/*
	window.onblur = function() {
	    console.log("网页失去焦点，可能进入后台");
	    // 在这里可以处理失去焦点的逻辑
	};
	
	window.onfocus = function() {
	    console.log("网页重新获得焦点");
	    // 在这里可以处理重新获得焦点的逻辑
	};
*/



///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//展示用户信息
function displayUserInfo(username, password) {
	document.getElementById('userInfo').textContent = `登录账号: ${username}`;

	document.getElementById('header').style.display = 'block';
}
// 用户信息部分
function displayStudentInfo(studentInfo) {

	console.log('此函数用于显示学生信息');
	console.log(studentInfo);


	const name = studentInfo.XM || "未知";
	const major = studentInfo.ZYMC || "未知";
	const term = studentInfo.XNMC || "未知";
	const pid = studentInfo.XH || "未知";
	const cid = studentInfo.BJMC || "未知";
	document.getElementById('userInfo').textContent = `用户: ${cid}-${name}-${pid}`;

	document.getElementById('header').style.display = 'block';
	return ``;
	//	return `<div id="userinfo"><p>用户: ${name} ${cid} ${pid}</p></div>`;

}

// 日期信息部分
function displayDateInfo(sjkList, rqazcList, xqjmcMap) {


	console.log('此函数用于显示日期信息');
	console.log(sjkList);


	const date = sjkList[0].dateDigitSeparator || "未知日期";
	const dayInfo = rqazcList.find(item => item.rq === date);

	

	//	if (dayInfo) {
	// 更新全局变量 dayName
	//dayName = xqjmcMap[dayInfo.xqj.toString()] || "未知星期";
	console.log(dayName);
	console.log("####");
	const weekdaya = getCurrentWeekday();
	//217
	console.log(`217今天是：${weekdaya}`);
	dayName = weekdaya;
	/*
	const todayn = new Date();
    const weekdaysn = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayOfWeekn = today.getDay(); // 0-6, 0代表星期天
//	dayName=dayOfWeekn;*/
	//console.log(dayOfWeekn);
	data_n = date;
	//return `<div id="datainfo"><p>现在: ${data_n} ${dayName} 第${WeekName}周</p></div>`;
	return ``;
	//} else {
	//	return `<li>日期异常！</li>`;
	//}
}


// 根据节次范围获取时间区间

function getScheduleTimeRange(range) {
	const scheduleTimeDate = [{
			"jcmc": "1",
			"qssj": "08:30",
			"jssj": "09:15"
		},
		{
			"jcmc": "2",
			"qssj": "09:20",
			"jssj": "10:05"
		},
		{
			"jcmc": "3",
			"qssj": "10:20",
			"jssj": "11:05"
		},
		{
			"jcmc": "4",
			"qssj": "11:10",
			"jssj": "11:55"
		},
		{
			"jcmc": "5",
			"qssj": "14:00",
			"jssj": "14:45"
		},
		{
			"jcmc": "6",
			"qssj": "14:50",
			"jssj": "15:35"
		},
		{
			"jcmc": "7",
			"qssj": "15:50",
			"jssj": "16:35"
		},
		{
			"jcmc": "8",
			"qssj": "16:40",
			"jssj": "17:25"
		},
		{
			"jcmc": "9",
			"qssj": "17:30",
			"jssj": "18:15"
		},
		{
			"jcmc": "10",
			"qssj": "19:00",
			"jssj": "19:45"
		},
		{
			"jcmc": "11",
			"qssj": "19:55",
			"jssj": "20:40"
		}
	];

	// 解析传入的节次范围，假设格式为 "1-2节"
	const [startLesson, endLesson] = range.split('-').map(Number);

	// 获取对应节次的开始时间和结束时间
	const startTime = scheduleTimeDate[startLesson - 1].qssj; // 需要减去 1，因为数组是从 0 开始的
	const endTime = scheduleTimeDate[endLesson - 1].jssj;

	// 返回时间区间
	return `${startTime}-${endTime}`;
}


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


// 显示今日课表  217 ERROR
function displayTodayCourses(kbList) {


	console.log('此函数用于显示今日课表');
	console.log(kbList);
	console.log('待分解的课表数据');


	let todaySchedule = ''; // 今日课程
	const scheduleByDay = {};

	// 组织课程按星期分类
	kbList.forEach(course => {

		console.log('待分解的课表数据2');


		const ncour = course.jc || "未知节次"; // 节次（如 "1-2节"）
		const teacher = course.xm || "未知老师"; // 老师
		const courseName = course.jxbmc || "未知课程"; // 课程名称
		const newText = courseName.slice(0, -5); // 去除后5位字符
		const location = course.cdmc || "未知地点"; // 上课地点
		const week = course.xqjmc || "未知星期"; // 星期

		// 如果没有该星期的记录，初始化为空数组
		if (!scheduleByDay[week]) {
			scheduleByDay[week] = [];
		}

		// 提取节次的数字部分（例如 "1-2节" -> "1-2"）
		const lessonRange = ncour.replace('节', ''); // 去掉“节”字，得到“1-2”这样的格式

		// 获取节次时间区间，例如 "1-2"
		const timeRange = getScheduleTimeRange(lessonRange); // 获取节次对应的时间范围

		// 将课程添加到对应星期的列表中，附加时间区间
		scheduleByDay[week].push(
			`<div class="dashed-border"></div><div class="ToadyCouseDetial_Ncourse">${ncour}</div><div class="ToadyCouseDetial_timeRange">${timeRange}</div><div class="ToadyCouseDetial_Location">${location}</div><div class="ToadyCouseDetial_Name"> ${newText},</div> `
		);
	});

	// 确保当前日期的 key 存在
	if (scheduleByDay[dayName] && scheduleByDay[dayName].length > 0) {
		todaySchedule = `<div id="Todaybox" class="body_box"><div id="today-daytitle">今日课表 ${dayName}</div>`;
		scheduleByDay[dayName].forEach(course => {
			todaySchedule += `<div class="ToadyCouseDetial">${course}</div>`; // 使用 <h3> 显示课程
		});
		todaySchedule += `</div>`;
	} else {
		// 当天没有课程时的提示
		todaySchedule = `
            <div id="Todaybox" class="body_box">
                <div id="today-daytitle">今日课表 ${data_n} 第${WeekName}周 ${dayName} </div>
                <div class="no-courses">今天没有课程安排</div>
            </div>
        `;
	}
	//console.log("inputHtml");
	//console.log("original input text:", todaySchedule);
	console.log(processTodayCoursesAsText(todaySchedule));
	//processTodayCoursesAsText(todaySchedule);
	//console.log(todaySchedule);
	// 返回课程表 HTML
	return processTodayCoursesAsText(todaySchedule);

}


function processTodayCoursesAsText(inputHtml) {


	console.log("inputHtml");
	console.log("original input text:", inputHtml);

	// 获取当前时间
	const now = new Date();
	const currentTime = now.getHours() * 60 + now.getMinutes();

	// 用于匹配时间段的正则（全局匹配）
	const timeRegex = /(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/g;

	// 初始化结果
	let resultHtml = inputHtml;
	let foundCurrentCourse = false; // 标记是否已找到正在上的课程
	let closestNextCourseBlock = null; // 用于存储最接近的下一节课程块
	let closestTimeDiff = Infinity; // 用于存储最接近下一节课的时间差
	let allCoursesEndTime = 0; // 用于记录所有课程的最晚结束时间

	// 遍历所有匹配的时间段
	const matches = [...inputHtml.matchAll(timeRegex)];

	matches.forEach((match) => {
		const startTimeStr = match[1];
		const endTimeStr = match[2];
		const startTime = startTimeStr.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m));
		const endTime = endTimeStr.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m));

		// 更新所有课程的最晚结束时间
		allCoursesEndTime = Math.max(allCoursesEndTime, endTime);
		console.log("结束勒！！！！:", allCoursesEndTime);

		// 找到时间段附近的课程块
		const matchIndex = match.index;
		const courseStart = inputHtml.lastIndexOf('<div class="ToadyCouseDetial_Ncourse">', matchIndex);
		const courseEnd = inputHtml.indexOf('</div>', matchIndex) + 6;
		const fullBlock = inputHtml.substring(courseStart, courseEnd);

		console.log("Matched block:", fullBlock);

		// 判断当前时间和课程时间的关系
		if (currentTime >= startTime && currentTime <= endTime && !foundCurrentCourse) {
			console.log("Current course found.");
			// 在整个课程块外面加上 <p>，标记“正在上这节课”
			const wrappedBlock =
				`<div id="NextClassingTitleBox"><div class="crying-face-container"><style>.crying-face-container{width:15px;height:15px;position:relative;display: inline-block;}.face{width:100%;height:100%;background-color:yellow;border-radius:50%;position:relative;}.eye{width:15%;height:15%;background-color:black;border-radius:50%;position:absolute;top:25%;}.eye.left{left:20%;}.eye.right{right:20%;}.mouth{width:60%;height:25%;border:1px solid black;border-radius:0 0 50% 50%;position:absolute;bottom:20%;left:50%;transform:translateX(-50%) rotate(180deg);}.tear{width:10%;height:15%;background-color:blue;border-radius:50%;position:absolute;bottom:10%;animation:fall 1s infinite;}.tear.left{left:20%;}.tear.right{right:20%;}@keyframes fall{0%{bottom:10%;opacity:1;}50%{bottom:30%;opacity:0.5;}100%{bottom:10%;opacity:1;}}</style><div class="face"><div class="eye left"></div><div class="eye right"></div><div class="mouth"></div><div class="tear left"></div><div class="tear right"></div></div></div><div id="Classing">正在上这节课</div></div><br>${fullBlock}`;
			resultHtml = resultHtml.replace(fullBlock, wrappedBlock);
			foundCurrentCourse = true; // 标记已找到正在上的课程
		} else if (currentTime < startTime) {
			// 如果当前时间小于课程开始时间，计算时间差
			const timeDiff = startTime - currentTime;

			// 更新最近的下一节课程块
			if (timeDiff < closestTimeDiff) {
				closestTimeDiff = timeDiff;
				closestNextCourseBlock = fullBlock;
			}
		}
	});

	// 如果未标记“正在上的课程”，但找到最接近的“下一节课”，则标记为“下一节课”
	if (!foundCurrentCourse && closestNextCourseBlock) {
		console.log("Marking closest next course.");
		const wrappedBlock =
			`<div id="NextClassAlarmTitleBox"><div class="runner-container" style="width: 15px; height: 15px; position: relative; margin: 0;"><style>.runner-container {width: 200px; height: 200px; position: relative; margin: 50px auto;} .body {position: absolute; top: 20%; left: 50%; width: 10%; height: 30%; background-color: black; transform: translateX(-50%);} .head {position: absolute; top: 0; left: 50%; width: 20%; height: 20%; background-color: black; border-radius: 50%; transform: translateX(-50%);} .arm {position: absolute; width: 10%; height: 30%; background-color: black; top: 25%; transform-origin: top center;} .arm.left {left: 30%; transform: rotate(45deg); animation: swing-left 1s infinite;} .arm.right {right: 30%; transform: rotate(-45deg); animation: swing-right 1s infinite;} .leg {position: absolute; width: 10%; height: 40%; background-color: black; bottom: 0; transform-origin: top center;} .leg.left {left: 30%; transform: rotate(-45deg); animation: run-left 1s infinite;} .leg.right {right: 30%; transform: rotate(45deg); animation: run-right 1s infinite;} @keyframes swing-left {0%, 100% {transform: rotate(-45deg);} 50% {transform: rotate(30deg);}} @keyframes swing-right {0%, 100% {transform: rotate(-45deg);} 50% {transform: rotate(30deg);}} @keyframes run-left {0%, 100% {transform: rotate(-450deg);} 50% {transform: rotate(300deg);}} @keyframes run-right {0%, 100% {transform: rotate(450deg);} 50% {transform: rotate(-300deg);}}</style><div class="body"></div><div class="head"></div><div class="arm left"></div><div class="arm right"></div><div class="leg left"></div><div class="leg right"></div></div><div id="Nextclass">这是下一节课</div></div><br>${closestNextCourseBlock}`;
		resultHtml = resultHtml.replace(closestNextCourseBlock, wrappedBlock);
	}

	// 如果当前时间晚于所有课程结束时间，则清空所有课程内容，显示“今日课已经上完”
	if (currentTime > allCoursesEndTime) {
		console.log("All courses finished for today.");
		resultHtml = ` <div id="Todaybox" class="body_box"><p>今日课已经上完</p></div>`;
	}

	console.log("Final result:", resultHtml);
	return resultHtml; // 返回处理后的 HTML
}
//V1




/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


function displayWeekCourses(kbList) {
	// 从localStorage读取Displaymethod的值
	let displayMethod = localStorage.getItem('Displaymethod');
	console.log(displayMethod)
	// 如果Displaymethod不存在，设置默认值为displayWeekCourses_Table并执行
	if (!displayMethod) {
		displayMethod = 'displayWeekCourses_Table';
		localStorage.setItem('Displaymethod', displayMethod);
	}

	// 根据Displaymethod的值执行对应的函数
	let weekSchedule;
	if (displayMethod === 'displayWeekCourses_Table') {
		weekSchedule = displayWeekCourses_Table(kbList);
	} else if (displayMethod === 'displayWeekCourses_Text') {
		weekSchedule = displayWeekCourses_Text(kbList);
	}

	// 返回weekSchedule
	return weekSchedule;
}



function SwitchDisplayWeekCourses() {
	// 从localStorage读取Displaymethod的值
	let displayMethod = localStorage.getItem('Displaymethod');

	// 判断Displaymethod的值并进行切换
	if (displayMethod === 'displayWeekCourses_Table') {
		localStorage.setItem('Displaymethod', 'displayWeekCourses_Text');
	} else if (displayMethod === 'displayWeekCourses_Text') {
		localStorage.setItem('Displaymethod', 'displayWeekCourses_Table');
	}

	// 执行ReSendRequestWeekCourse函数
	ReSendRequestWeekCourse();
}
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////









///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
function displayWeekCourses_Table(kbList) {
	// 初始化表格结构
	let weekSchedule = `
        <div id="Weekbox" class="body_box">
		<div class="dashed-border" id="TimeLine"></div>
		<div id="PowerLineBox" >
		    <div id="PowerLineCircle"></div>
		    <div id="PowerLine_line"></div>
		</div>


		    <div id="CyBox">
        <div id="CyBox_Text1" class="PowerLineSText">未知</div>
        <div id="CyBox_Text2" class="PowerLineSText">N/A钟</div>
    </div>

            <div id="week-title" onclick="SwitchDisplayWeekCourses()">本周是:第${WeekName}周</div>
            <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse;">
                <thead id="TableHorizontalTitle">
                    <tr>
                        <th id="TableFirstGrid">节次</th>
                        <th id="TableWeekTitle1">一</th>
                        <th id="TableWeekTitle2">二</th>
                        <th id="TableWeekTitle3">三</th>
                        <th id="TableWeekTitle4">四</th>
                        <th id="TableWeekTitle5">五</th>
                        <th id="TableWeekTitle6">六</th>
                        <th id="TableWeekTitle7">日</th>
                    </tr>
                </thead>
                <tbody>
    `;

	// 初始化课表数据结构
	const scheduleTable = Array.from({
		length: 11
	}, () => ({
		"一": null,
		"二": null,
		"三": null,
		"四": null,
		"五": null,
		"六": null,
		"日": null
	}));

	// 为每门课程分配颜色
	const courseColors = {};
	kbList.forEach(course => {
		const courseName = course.jxbmc || "未知课程";
		if (!courseColors[courseName]) {
			courseColors[courseName] = getRandomRGBA(0.25);
		}
	});

	// 遍历课程表，填充到对应的表格位置
	kbList.forEach(course => {
		const ncour = course.jc || "未知节次"; // 课程节次
		const courseName = course.jxbmc || "未知课程"; // 课程名称
		const newText = courseName.slice(0, -5); // 去掉最后五个字符
		const location = course.cdmc || "未知地点"; // 上课地点
		const weekFull = course.xqjmc || "未知星期"; // 星期几（完整）

		// 将“星期一”转为“一”
		const week = weekFull.replace("星期", "");

		// 解析节次范围，例如 "3-4节"
		const match = ncour.match(/^(\d+)-(\d+)节$/);
		if (match) {
			const start = parseInt(match[1]);
			const end = parseInt(match[2]);

			// 填充到对应节次和星期的单元格
			if (scheduleTable[start - 1][week] === null) {
				scheduleTable[start - 1][week] = {
					rowspan: end - start + 1,
					content: `${newText}<br>${location}`,
					color: courseColors[courseName] // 获取课程对应颜色
				};

				// 将其余节次标记为已被合并
				for (let i = start; i < end; i++) {
					scheduleTable[i][week] = "MERGED";
				}
			}
		}
	});

	// 构建表格内容
	for (let i = 0; i < scheduleTable.length; i++) {
		const time = scheduleTimeDate[i]; // 获取当前节次的时间
		const startTime = time.qssj; // 开始时间
		const endTime = time.jssj; // 结束时间

		// 在节次后面添加时间并设置字体较小
		weekSchedule +=
			`<tr><td id="NCouser${i + 1}">${i + 1}节<br><span class="ClassTableTimetie" style="font-size: 12px; color: #666;">${startTime} <br>~<br> ${endTime}</span></td>`;
		["一", "二", "三", "四", "五", "六", "日"].forEach(day => {
			const cell = scheduleTable[i][day];
			if (cell === "MERGED") {
				// 跳过已被合并的单元格
				return;
			}
			if (cell && cell.rowspan > 1) {
				// 输出带合并的单元格
				weekSchedule +=
					`<td rowspan="${cell.rowspan}" style="background-color: ${cell.color};">${cell.content}</td>`;
			} else {
				// 输出普通单元格
				weekSchedule +=
					`<td style="background-color: rgba(0,0,0,0.03); border: 1px dashed #ccc;">${cell ? cell.content : ""}</td>`;
			}
		});
		weekSchedule += `</tr>`;
	}

	// 结束表格结构
	weekSchedule += `
                </tbody>
            </table>
        </div>
    `;

	return weekSchedule;
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
function getElementTotalHeight(id) {
	const element = document.getElementById(id);
	const style = window.getComputedStyle(element);

	// 获取元素内容的高度（不包含边框和外边距）
	const height = parseFloat(style.height);

	// 获取边框的宽度（上下、左右）
	const borderTop = parseFloat(style.borderTopWidth);
	const borderBottom = parseFloat(style.borderBottomWidth);

	// 获取内边距的大小（上下、左右）
	const paddingTop = parseFloat(style.paddingTop);
	const paddingBottom = parseFloat(style.paddingBottom);

	// 获取外边距的大小（上下）
	const marginTop = parseFloat(style.marginTop);
	const marginBottom = parseFloat(style.marginBottom);

	// 计算总高度（内容高度 + 内边距 + 边框 + 外边距）
	const totalHeight = height + paddingTop + paddingBottom + borderTop + borderBottom + marginTop + marginBottom;
	//console.log(totalHeight)
	return totalHeight;
}
/////////////////////////////////////////////////
function getElementTotalWidth(id) {
	const element = document.getElementById(id);
	const style = window.getComputedStyle(element);

	// 获取元素内容的宽度（不包含边框和外边距）
	const width = parseFloat(style.width);

	// 获取边框的宽度（左右）
	const borderLeft = parseFloat(style.borderLeftWidth);
	const borderRight = parseFloat(style.borderRightWidth);

	// 获取内边距的大小（左右）
	const paddingLeft = parseFloat(style.paddingLeft);
	const paddingRight = parseFloat(style.paddingRight);

	// 获取外边距的大小（左右）
	const marginLeft = parseFloat(style.marginLeft);
	const marginRight = parseFloat(style.marginRight);

	// 计算总宽度（内容宽度 + 左右内边距 + 左右边框 + 左右外边距）
	const totalWidth = width + paddingLeft + paddingRight + borderLeft + borderRight + marginLeft + marginRight;

	//console.log(totalWidth);
	return totalWidth;
}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// 获取当前时间并返回对应状态
function getClassStatus() {
	const now = new Date();
	const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
	let result = '';

	// 如果当前时间在第一节课之前
	if (currentTime < scheduleTimeDate[0].qssj) {
		result = 'NotStarted'; // 课未开始
	} else if (currentTime > scheduleTimeDate[scheduleTimeDate.length - 1].jssj) {
		// 如果当前时间在最后一节课之后
		result = 'End'; // 课程结束
	} else {
		// 判断当前时间在两节课之间还是在某一节课中
		let currentClass = null;
		let nextClass = null;

		for (let i = 0; i < scheduleTimeDate.length; i++) {
			const classInfo = scheduleTimeDate[i];

			// 如果当前时间在某节课的时间范围内
			if (currentTime >= classInfo.qssj && currentTime <= classInfo.jssj) {
				currentClass = classInfo;
				const elapsedMinutes = calculateElapsedMinutes(classInfo.qssj, currentTime);
				result = `Classing ${currentClass.jcmc} 已上课 ${elapsedMinutes} 分钟`;
				break;
			}

			// 如果当前时间在两节课之间
			if (currentTime > classInfo.jssj && i < scheduleTimeDate.length - 1 && currentTime < scheduleTimeDate[i + 1]
				.qssj) {
				nextClass = scheduleTimeDate[i + 1];
				const minutesToNextClass = calculateElapsedMinutes(currentTime, nextClass.qssj);
				result = `Breaking ${nextClass.jcmc} 距离下一节课还有 ${minutesToNextClass} 分钟`;
				break;
			}
		}
	}
	//console.log(result)
	return result;
}

// 计算时间差（单位：分钟）
function calculateElapsedMinutes(startTime, endTime) {
	const [startHour, startMinute] = startTime.split(':').map(Number);
	const [endHour, endMinute] = endTime.split(':').map(Number);

	const startDate = new Date();
	startDate.setHours(startHour, startMinute, 0);

	const endDate = new Date();
	endDate.setHours(endHour, endMinute, 0);

	const diffMilliseconds = endDate - startDate;
	return Math.floor(diffMilliseconds / (1000 * 60)); // 转换为分钟
}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function setTimeLineTop() {

	//getElementTotalWidth('TableHorizontalTitle')
	//获取盒padding
	// 获取盒子的 padding
	const paddingTop = parseFloat(window.getComputedStyle(document.getElementById("Weekbox")).paddingTop);
	//console.log("paddingTop", paddingTop);


	// 获取基础高度（week-title 和 TableFirstGrid 的高度之和）
	const baseHeight = getElementTotalHeight('week-title') + getElementTotalHeight('TableFirstGrid') + paddingTop;



	// 获取当前课程状态
	const classStatus = getClassStatus();

	let topPosition = baseHeight; // 初始位置为基础高度

	// 处理课程状态
	if (classStatus === 'NotStarted') {
		// 课程未开始，直接设置 top 为基础高度
		topPosition = baseHeight;
		document.getElementById('CyBox_Text1').textContent = ` 一天`;
		document.getElementById('CyBox_Text2').textContent = ` 还没来`;
	} else if (classStatus.startsWith('Classing')) {
		// 正在上课，计算已上课的分钟数
		//console.log("classing")
		const classingInfo = classStatus.split(' ');
		//console.log("classing", classingInfo)

		const currentClassIndex = parseInt(classingInfo[1]) - 1; // 当前节次
		//console.log("classing", currentClassIndex)
		const elapsedMinutes = parseInt(classingInfo[3]);
		//console.log("classing", elapsedMinutes)
		// 计算之前节次的总高度
		let previousClassesHeight = 0;
		for (let i = 0; i < currentClassIndex; i++) {
			previousClassesHeight += getElementTotalHeight('NCouser' + (i + 1))-1;
			//console.log("classing td", i + 1)
		}

		// 获取当前节次的高度
		const currentClassHeight = getElementTotalHeight('NCouser' + (currentClassIndex + 1));

		// 计算已经上课的比例
		const classingHeight = (elapsedMinutes / 45) * currentClassHeight;

		// 设置 TimeLine 的 top
		topPosition = baseHeight + previousClassesHeight + classingHeight;
		ElseMinutes=45-elapsedMinutes;
		document.getElementById('CyBox_Text1').textContent = ` 距下课`;
		document.getElementById('CyBox_Text2').textContent = ` ${ElseMinutes}min`;
	} else if (classStatus.startsWith('Breaking')) {
		const classingInfo = classStatus.split(' ');
		const ElseMinutes = parseInt(classingInfo[3]);



		// 课间休息，计算之前节次的总高度
		const nextClassIndex = parseInt(classStatus.split(' ')[1]) - 1;

		let previousClassesHeight = 0;
		for (let i = 0; i < nextClassIndex; i++) {
			previousClassesHeight += getElementTotalHeight('NCouser' + (i + 1))-1;
		}

		// 设置 TimeLine 的 top
		topPosition = baseHeight + previousClassesHeight;
		document.getElementById('CyBox_Text1').textContent = ` 休息中`;
		document.getElementById('CyBox_Text2').textContent = ` 课间`;



	} else if (classStatus === 'End') {
		// 课程结束，计算所有节次的总高度
		let totalClassHeight = 0;
		for (let i = 0; i < scheduleTimeDate.length; i++) {
			totalClassHeight += getElementTotalHeight('NCouser' + (i + 1))-1;
		}

		// 设置 TimeLine 的 top
		topPosition = baseHeight + totalClassHeight;
		document.getElementById('CyBox_Text1').textContent = ` 结束了`;
		document.getElementById('CyBox_Text2').textContent = ` 一天`;
	}

	// 设置 id 为 TimeLine 的元素的 top 值
	document.getElementById('TimeLine').style.top = topPosition + 'px';
//初始化宽度
	const TimeLineWidth = getElementTotalWidth('TableHorizontalTitle');
	document.getElementById('TimeLine').style.width = TimeLineWidth + 'px';
	
	setPowerTimeLineTop()
	
	////////////
	
	
	//const today1 = new Date();
	//console.log(today1)
	//const test1129 = today1.getDay();
	//console.log("today",test1129);
}

function setPowerTimeLineTop() {
    // 获取周视图的左侧填充
    const paddingLeft = parseFloat(window.getComputedStyle(document.getElementById("Weekbox")).paddingLeft);
    const baseWidth = getElementTotalWidth('TableFirstGrid') + paddingLeft;

    // 获取时间轴的顶部位置
    const TimeLineTop = parseFloat(window.getComputedStyle(document.getElementById("TimeLine")).top);
    const PowerTimeLineTop = TimeLineTop - 5;
    document.getElementById('PowerLineBox').style.top = PowerTimeLineTop + 'px';

    // 获取今天是星期几
    const today = new Date();
    let DayOfWeek = today.getDay();
    if (DayOfWeek === 0) {//大坑
        DayOfWeek = 7; // 将周日转换为 7
    }

    // 计算之前列的总宽度
    let previousWeekWidth = 0;
    for (let i = 1; i < DayOfWeek; i++) {
        const weekTitleWidth = getElementTotalWidth('TableWeekTitle' + i);
        if (!isNaN(weekTitleWidth)) {
            previousWeekWidth += weekTitleWidth - 1; // 减去分隔线宽度
        }
    }

    // 设置 PowerLineBox 的左侧位置
    const PowerTimeLineleft = baseWidth + previousWeekWidth;
    document.getElementById('PowerLineBox').style.left = PowerTimeLineleft + 'px';

    // 设置 PowerLineBox 的宽度
    const todayWidth = getElementTotalWidth('TableWeekTitle' + DayOfWeek);
    if (!isNaN(todayWidth)) {
        document.getElementById('PowerLineBox').style.width = todayWidth + 'px';
    }

    // 调整 CyBox 的字体大小
    const timeLineWidth = getElementTotalWidth('TableFirstGrid') / 3;
    document.getElementById('CyBox').style.fontSize = (timeLineWidth / 3) * 1.4 + 'px';

    // 调用其他样式设置函数
    SetCyBoxStyle();
}

function SetCyBoxStyle(){
	const TimeLineTop = parseFloat(window.getComputedStyle(document.getElementById("TimeLine")).top);
	document.getElementById('CyBox').style.top = TimeLineTop + 'px';


}
   //let num = 1;
   setInterval(function () {
      // num ++;
      // console.log(num);
   	   setTimeLineTop();
   
   }, 1000);

// 获取 week-title 和 TableFirstGrid 的总高度（包括外边距）
//const weekTitleHeight = getElementTotalHeight('week-title');
//const tableFirstGridHeight = getElementTotalHeight('TableFirstGrid');

//console.log('week-title 总高度:', weekTitleHeight);
//console.log('TableFirstGrid 总高度:', tableFirstGridHeight);
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function createVerticalRotationEffect({
	containerId,
	textClass,
	radius = 3,
	centerZ = 15,
	speed = 0.05
	

}) {
	centerZ = 15,
	console.log(centerZ,"la");
	const container = document.getElementById(containerId);
	const texts = Array.from(container.getElementsByClassName(textClass));
	let angle = 0;

	function update() {
		angle += speed;
		texts.forEach((text, index) => {
			const currentAngle = angle + index * Math.PI; // 两段文字相隔180度
			const y = radius * Math.sin(currentAngle); // 调整Y坐标
			const z = centerZ + radius * Math.cos(currentAngle); // 调整Z坐标

			const scale = z / (centerZ * 2); // 根据Z轴距离调整缩放
			const opacity = scale > 0 ? scale : 0;

			text.style.transform = `
				translate3d(-50%, ${y}px, ${z}px)
				scale(${1 + scale})
			`;
			text.style.opacity = opacity;
		});

		requestAnimationFrame(update);
	}

	update();
}


///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function displayWeekCourses_Text(kbList) {
	let weekSchedule =
		`<div id="Weekbox" class="body_box"><div id="week-title" onclick="SwitchDisplayWeekCourses()">本周课表:第${WeekName}周</div>`; // 本周课表

	const scheduleByDay = {};

	// 组织课程按星期分类
	kbList.forEach(course => {
		const ncour = course.jc || "未知节次";
		const teacher = course.xm || "未知老师";
		const courseName = course.jxbmc || "未知课程";
		const originalText = courseName;
		const newText = originalText.slice(0, -5); // 去除后5位字符
		const location = course.cdmc || "未知地点";
		const week = course.xqjmc || "未知星期";

		// 如果没有该星期的记录，初始化为空数组
		if (!scheduleByDay[week]) {
			scheduleByDay[week] = [];
		}

		// 将课程添加到对应星期的列表中
		scheduleByDay[week].push(`${ncour}: ${newText}, ${teacher}, ${location}`);
	});

	// 添加本周课表
	for (const [day, courses] of Object.entries(scheduleByDay)) {

		weekSchedule += `<h3 class="day-header">${day}</h3>`;
		courses.forEach(course => {
			weekSchedule += `<p>${course}</p>`; // 使用 <p> 显示其他课程
		});

	}
	weekSchedule += `</div>`;

	return weekSchedule;
}


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////////////////


// 睡觉课信息部分，显示睡觉课的安排（废弃）
function displaySleepCourses(sjkList) {
	let output = "<br><h3>睡觉课安排🤣:</h3>";
	sjkList.forEach(course => {
		const teacher = course.jsxm || "未知老师";
		const courseName = course.kcmc || "未知课程";
		const location = course.cdmc || "未知地点";
		const week = course.qsjsz || "未知时间";
		output += `<p>${week},${courseName},${teacher},${location}</p>`;
	});
	return output;
}



//选择周
function displayWeekChoose() {
	let output =
		'<div id="OtherWeekbox" class="body_box"><h3>查询其他周课表</h3><select id="week-select" class="custom-select">';

	// 生成 1 到 20 周的选项
	output += '<option value="" disabled selected>请选择周数</option>';
	for (let i = 1; i <= 20; i++) {
		output += `<option value="${i}">${i} 周</option>`;
	}

	output += '</select>';

	output += '<button id="TrunToAimWeek" type="button" onclick="sendRequestOtherWeekCourse()">查询</button>'
	output += '<button id="TrunToNextWeek" type="button" onclick="sendRequestNextWeekCourse()">下周课表</button>'

	return output;


}

//其他周样式整理
function displayFormattedData_OtherWeek(json_data, isCached = false) {
	const scheduleContainer = document.getElementById('schedule-container');
	let output = "";

	const studentInfo = json_data.xsxx || {};
	output += displayStudentInfo(studentInfo); // 用户信息部分

	if (json_data.kbList && json_data.kbList.length > 0) {

	//if (1===1) {
		//output += displayDateInfo(json_data.sjkList, json_data.rqazcList, json_data.xqjmcMap); // 日期信息部分
		output += `<div id="Weekbox_OtherWeek" class="body_box"><h3>其他周课表: 第${WeekName}周丨今天是第${ToWeek}周</h3>`

		output += displayWeekCourses(json_data.kbList);
		output += "</div>"
		output += displayWeekChoose();

		output += '<button id="ReturnToCurrentWeek" type="button" onclick="sendLoginRequest()">返回本周</button></div>'


		//output += displaySleepCourses(json_data.sjkList); // 睡觉课信息部分
	} else {
		output += "<p>课程列表为空或缺失</p>";
	}

	if (isCached) {
		output = `<p>（显示上次成功获取的数据）</p>${output}`;
	}

	// 将生成的 HTML 插入容器
	scheduleContainer.innerHTML = output;
	setRandomBackgroundColor("Weekbox")
	setRandomBackgroundColor("OtherWeekbox")
	setRandomBackgroundColor_body("header")

}




// 主函数：生成并显示格式化数据
function displayFormattedData(json_data, isCached = false) {

	//217
	console.log("已经调用displayFormattedData函数");
	console.log(json_data);


	const scheduleContainer = document.getElementById('schedule-container');
	let output = "";

	const studentInfo = json_data.xsxx || {};
	output += displayStudentInfo(studentInfo); // 用户信息部分
//217
	if (json_data.kbList && json_data.kbList.length > 0) {

//	if (1===1) {
		console.log("已经进入了判断");
		//217
		//output += displayDateInfo(json_data.sjkList, json_data.rqazcList, json_data.xqjmcMap); // 日期信息部分
		///////217temp
		///获取星期几
		console.log(dayName);
		console.log("####");
		const weekdaya = getCurrentWeekday();
		//217
		console.log(`217今天是：${weekdaya}`);
		dayName = weekdaya;




		/////
		output += displayTodayCourses(json_data.kbList); // 今日课表

		output += displayWeekCourses(json_data.kbList);
		output += displayWeekChoose();


		//output += displaySleepCourses(json_data.sjkList); // 睡觉课信息部分
	} else {
		output += "<p>课程列表为空或缺失</p>";
	}

	if (isCached) {
		output = `<p>（显示上次成功获取的数据）</p>${output}`;
	}

	// 将生成的 HTML 插入容器
	scheduleContainer.innerHTML = output;
	setRandomBackgroundColor("Todaybox");
	setRandomBackgroundColor("Weekbox");
	setRandomBackgroundColor("OtherWeekbox");
	setRandomBackgroundColor_body("header");
	////////////

	
	createVerticalRotationEffect({
		containerId: "CyBox",
		textClass: "PowerLineSText",
		radius: 20,
		centerZ: 150,
		speed: 0.04
	});




	//////////////////
}
/*

//查看其它周课程表
async function sendRequestOtherWeekCourse(retries = 0) {
	let output = '函数已被调用';
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const responseContainer = document.getElementById('responseContainer');
	const responseData = document.getElementById('responseData');

	// 获取下拉框的选中周数
	const weekSelect = document.getElementById('week-select');
	const weekNumber = weekSelect.value;
	WeekName = weekNumber

	if (!weekNumber) {
		alert("请选择周数！");
		return;
	}

	if (!username || !password) {
		alert("请输入用户名和密码！");
		return;
	}

	// 保存用户信息和更新UI
	// 可选择是否保存记住我
	updateUIForLoading();

	try {
		// 请求数据并处理返回
		const json_data = await fetchDataFromServer(username, password, weekNumber, retries);

		displayUserInfo(username, password); // 显示用户信息
		hideLoginContainer(); // 隐藏登录容器
		updateUIForResponse_OtherWeek(responseContainer, responseData, json_data); // 更新UI以显示数据

		// 保存数据到 localStorage


	} catch (error) {
		handleRequestError(responseContainer, responseData, error);
	} finally {
		hideLoadingContainer();
	}
}

*/

/*

//查看下周课程表
async function sendRequestNextWeekCourse(retries = 0) {
	let output = '函数已被调用';
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const responseContainer = document.getElementById('responseContainer');
	const responseData = document.getElementById('responseData');

	// 获取下拉框的选中周数
	const weekSelect = document.getElementById('week-select');
	const weekNumber = parseInt(WeekName) + 1;
	WeekName = weekNumber


	if (!username || !password) {
		alert("请输入用户名和密码！");
		return;
	}

	// 保存用户信息和更新UI
	// 可选择是否保存记住我
	updateUIForLoading();

	try {
		// 请求数据并处理返回
		const json_data = await fetchDataFromServer(username, password, weekNumber, retries);

		displayUserInfo(username, password); // 显示用户信息
		hideLoginContainer(); // 隐藏登录容器
		updateUIForResponse_OtherWeek(responseContainer, responseData, json_data); // 更新UI以显示数据

		// 保存数据到 localStorage


	} catch (error) {
		handleRequestError(responseContainer, responseData, error);
	} finally {
		hideLoadingContainer();
	}
}
// 监听下拉框的变化
*/

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////



// 查看其它周课程表
// 查看其它周课程表
async function sendRequestOtherWeekCourse(retries = 0) {
	let output = '函数已被调用';
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const responseContainer = document.getElementById('responseContainer');
	const responseData = document.getElementById('responseData');

	// 获取下拉框的选中周数
	const weekSelect = document.getElementById('week-select');
	const weekNumber = weekSelect.value;
	WeekName = weekNumber;

	if (!weekNumber) {
		alert("请选择周数！");
		return;
	}

	// 如果选中周数等于 ToWeek，直接调用 ReturningUserLogin 函数
	if (parseInt(weekNumber) === ToWeek) {
		ReturningUserLogin();
		return;
	}

	if (!username || !password) {
		alert("请输入用户名和密码！");
		return;
	}

	// 保存用户信息和更新UI
	updateUIForLoading();

	try {
		// 从 localStorage 读取数据
		const weekKey = `week_${weekNumber}`;
		const localData = localStorage.getItem(weekKey);

		if (localData) {
			console.log(`从 LocalStorage 获取到第 ${weekNumber} 周数据`);
			const jsonData = JSON.parse(localData);

			// 显示数据
			displayUserInfo(username, password); // 显示用户信息
			hideLoginContainer(); // 隐藏登录容器
			updateUIForResponse_OtherWeek(responseContainer, responseData, jsonData); // 更新UI以显示数据

			// 调用服务器接口检查是否有更新
			fetchWeekDataFromServer(weekNumber, jsonData);
		} else {
			alert(`未找到第 ${weekNumber} 周的数据，请确保数据已预存或联网请求数据。`);
		}
	} catch (error) {
		handleRequestError(responseContainer, responseData, error);
	} finally {
		hideLoadingContainer();
	}
}



// 查看下周课程表
async function sendRequestNextWeekCourse(retries = 0) {
	let output = '函数已被调用';
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const responseContainer = document.getElementById('responseContainer');
	const responseData = document.getElementById('responseData');

	// 获取下周的周数
	const weekNumber = parseInt(WeekName) + 1;
	WeekName = weekNumber;

	if (!username || !password) {
		alert("请输入用户名和密码！");
		return;
	}
	if (parseInt(weekNumber) === ToWeek) {
		ReturningUserLogin();
		return;
	}

	// 保存用户信息和更新UI
	updateUIForLoading();

	try {
		// 从 localStorage 读取数据
		const weekKey = `week_${weekNumber}`;
		const localData = localStorage.getItem(weekKey);

		if (localData) {
			console.log(`从 LocalStorage 获取到第 ${weekNumber} 周数据`);
			const jsonData = JSON.parse(localData);

			// 显示数据
			displayUserInfo(username, password); // 显示用户信息
			hideLoginContainer(); // 隐藏登录容器
			updateUIForResponse_OtherWeek(responseContainer, responseData, jsonData); // 更新UI以显示数据

			// 调用服务器接口检查是否有更新
			fetchWeekDataFromServer(weekNumber, jsonData);
		} else {
			alert(`未找到第 ${weekNumber} 周的数据，请确保数据已预存或联网请求数据。`);
		}
	} catch (error) {
		handleRequestError(responseContainer, responseData, error);
	} finally {
		hideLoadingContainer();
	}
}



////自动刷新
async function ReSendRequestWeekCourse(retries = 0) {
	let output = '函数已被调用';
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const responseContainer = document.getElementById('responseContainer');
	const responseData = document.getElementById('responseData');

	// 获取下周的周数
	const weekNumber = parseInt(WeekName);
	WeekName = weekNumber;

	if (!username || !password) {
		alert("请输入用户名和密码！");
		return;
	}
	if (parseInt(weekNumber) === ToWeek) {
		try {
			const currentWeek = getCurrentWeekNumber();
			WeekName = currentWeek
			ToWeek = currentWeek
			const weekKey = `week_${currentWeek}`;
			const weekData = localStorage.getItem(weekKey);

			if (weekData) {
				console.log(`从 LocalStorage 获取到第 ${currentWeek} 周数据`);
				const jsonData = JSON.parse(weekData);

				// 显示课表数据
				hideLoginContainer();
				displayFormattedData(jsonData);
				document.getElementById('responseContainer').style.display = 'block';

				// 调用从服务器获取数据的函数
				//fetchWeekDataFromServer(currentWeek, jsonData);
			} else {
				console.log(`LocalStorage 中未找到第 ${currentWeek} 周数据`);
				alert(`未找到本周数据，请确保数据已预存。`);
			}
		} catch (error) {
			console.error("ReturningUserLogin 发生错误:", error);
			if (retries < 3) {
				console.log(`重试第 ${retries + 1} 次...`);
				ReturningUserLogin(retries + 1);
			} else {
				alert("加载失败，请检查网络连接或重新登录。");
			}
		}
		return;
	}

	// 保存用户信息和更新UI
	updateUIForLoading();

	try {
		// 从 localStorage 读取数据
		const weekKey = `week_${weekNumber}`;
		const localData = localStorage.getItem(weekKey);

		if (localData) {
			console.log(`从 LocalStorage 获取到第 ${weekNumber} 周数据`);
			const jsonData = JSON.parse(localData);

			// 显示数据
			displayUserInfo(username, password); // 显示用户信息
			hideLoginContainer(); // 隐藏登录容器
			updateUIForResponse_OtherWeek(responseContainer, responseData, jsonData); // 更新UI以显示数据

			// 调用服务器接口检查是否有更新
			//	fetchWeekDataFromServer(weekNumber, jsonData);
		} else {
			alert(`未找到第 ${weekNumber} 周的数据，请确保数据已预存或联网请求数据。`);
		}
	} catch (error) {
		handleRequestError(responseContainer, responseData, error);
	} finally {
		hideLoadingContainer();
	}
}



////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////








//隐藏登录界面
function hideLoginContainer() {
	document.getElementById('loginContainer').style.display = 'none';
}
//退出
function logout() {
	document.getElementById('loginContainer').style.display = 'block';
	document.getElementById('header').style.display = 'none';
	document.getElementById('responseContainer').style.display = 'none';
	localStorage.removeItem("username");
	localStorage.removeItem("password");
	localStorage.setItem("rememberMe", "false");

}



