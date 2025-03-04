from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
import json
import os
import time
from datetime import datetime
import logging
from logging.handlers import RotatingFileHandler





# 设置日志记录
log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# 控制台输出
console_handler = logging.StreamHandler()
console_handler.setFormatter(log_formatter)
console_handler.setLevel(logging.DEBUG)

# 文件输出，添加日志轮换
log_file = os.path.join(os.path.dirname(__file__), 'debug.log')
file_handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=3)  # 10MB大小，最多保留3个备份
file_handler.setFormatter(log_formatter)
file_handler.setLevel(logging.DEBUG)

# 配置日志
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[console_handler, file_handler])



app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# 设置CORS响应头
@app.after_request
def apply_cors(response):
    logging.info("#Applying CORS headers")
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    return response


# URL 和 POST 数据
url = "https://jwpd.jsei.edu.cn/kbcx/xskbcxMobile_cxXsKb.html"


# 获取 Cookies 带重试机制
def get_cookies_with_retries(driver, retries=5, delay=1):
    for attempt in range(1, retries + 1):
        try:
            logging.info(f"#Attempting to retrieve cookies (Attempt {attempt})...")
            cookies = driver.get_cookies()
            if cookies:
                cookies_string = "; ".join(f"{cookie['name']}={cookie['value']}" for cookie in cookies)
                logging.info(f"#Successfully retrieved cookies: {cookies_string}")

                # 检查是否包含 org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en;
                if "org.springframework.web.servlet.i18n.CookieLocaleResolver." in cookies_string:
                    logging.warning("!!!Account or password error, cookies contain invalid fields")
                    socketio.emit('error', {"error": "Invalid account or password"})  # 向客户端发送错误信息
                    return None  # 返回 None 表示错误

                return cookies_string
            else:
                logging.warning("!!!Failed to retrieve cookies, retrying...")
        except Exception as error:
            logging.error(f"!!!Error while retrieving cookies: {error}")
        time.sleep(delay)

    raise Exception("!!!Failed to retrieve cookies after maximum retry attempts")


# 请求 JSON 数据带重试机制
def fetch_data_with_retries(headers, retries=5, delay=1):
    data = {
        "xnm": "2024",
        "xqm": "12",
        "zs": f"{weekNumber}",
        "kblx": "1",
        "doType": "app"
    }
    for attempt in range(1, retries + 1):
        try:
            logging.info(f"#Attempting to fetch JSON data (Attempt {attempt})...")
            response = requests.post(url, data=data, headers=headers)
            if response.text and response.text != "null":
                logging.info("#Successfully retrieved JSON data")
                return response.json()
            else:
                logging.warning("#JSON data is empty or 'null', retrying...")
        except Exception as error:
            logging.error(f"#Error fetching JSON data: {error}")
        time.sleep(delay)
    raise Exception("#Failed to fetch JSON data after maximum retry attempts")


# 删除失效的 Cookies
def delete_invalid_cookies(username, password):
    file_path = os.path.join(os.path.dirname(__file__), 'cookies.json')
    if not os.path.exists(file_path):
        logging.info("#Cookies file not found, skipping deletion")
        return
    try:
        logging.info(f"#Deleting invalid cookies, reading file: {file_path}")
        with open(file_path, 'r') as file:
            cookies_file = json.load(file)
        new_cookies_file = [c for c in cookies_file if c['username'] != username or c['password'] != password]
        with open(file_path, 'w') as file:
            json.dump(new_cookies_file, file, indent=2)
        logging.info("#Invalid cookies deleted")
    except Exception as error:
        logging.error(f"!!!Error deleting invalid cookies: {error}")


# Save cookies to file
def save_cookies_to_file(username, password, cookie_string):
    file_path = os.path.join(os.path.dirname(__file__), 'cookies.json')
    cookies_data = {
        "username": username,
        "password": password,
        "cookieString": cookie_string,
        "timestamp": datetime.now().isoformat()
    }
    try:
        logging.info(f"#Saving cookies to file: {file_path}")
        cookies_file = []
        if os.path.exists(file_path):
            # Check if the file is empty
            if os.path.getsize(file_path) > 0:
                with open(file_path, 'r') as file:
                    try:
                        cookies_file = json.load(file)  # Attempt to load file contents
                    except json.JSONDecodeError:
                        logging.warning(f"!!!Invalid file format: {file_path}, reinitializing")
                        cookies_file = []  # Reinitialize as empty if file is invalid
        cookies_file.append(cookies_data)
        with open(file_path, 'w') as file:
            json.dump(cookies_file, file, indent=2)
        logging.info("#Cookies saved successfully")
    except Exception as err:
        logging.error(f"!!!Error saving cookies: {err}")


# 检查是否存在有效的 Cookies
def check_for_valid_cookies(username, password):
    file_path = os.path.join(os.path.dirname(__file__), 'cookies.json')
    if not os.path.exists(file_path):
        logging.info(f"#Cookies file not found: {file_path}")
        return None
    try:
        logging.info(f"#Checking for valid cookies, reading file: {file_path}")
        with open(file_path, 'r') as file:
            cookies_file = json.load(file)
        for cookie_data in cookies_file:
            if cookie_data['username'] == username and cookie_data['password'] == password:
                logging.info(f"#Found existing cookies, using: {cookie_data['cookieString']}")
                return cookie_data['cookieString']
    except Exception as error:
        logging.error(f"!!!Error reading or parsing cookies file: {error}")
    return None


def validate_and_get_cookies(username, password):
    cookies_string = check_for_valid_cookies(username, password)

    # 如果已有的 Cookies 包含 'org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en;' 字段，认为账号密码错误
    if cookies_string and "org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en;" in cookies_string:
        logging.warning(f"!!!Account or password error, cookies contain invalid 'LOCALE=en' field")
        socketio.emit('error', {"error": "Invalid account or password"})
        return None  # Return None to indicate an error

    # 如果 Cookies 无效或不存在，则获取新的 Cookies
    if cookies_string:
        if not are_cookies_valid(cookies_string, username, password):
            logging.info("#Existing cookies are invalid, attempting to retrieve new ones...")
            delete_invalid_cookies(username, password)
            cookies_string = None

    if not cookies_string:
        logging.info("#No valid cookies found, starting to retrieve new cookies...")
        cookies_string = fetch_new_cookies(username, password)

    return cookies_string

def are_cookies_valid(cookies_string, username, password):
    try:
        logging.info("#Checking if existing cookies are valid...")
        headers = {"Cookie": cookies_string}
        response = fetch_data_with_retries(headers)
        if "error" in response:  # If response contains error, cookies are invalid
            logging.warning("!!!Cookies are invalid")
            return False
        logging.info("#Cookies are valid")
        return True
    except Exception as e:
        logging.error(f"!!!Error checking cookies: {e}")
        delete_invalid_cookies(username, password)
        return False
    #            service = Service(r"D:\PY-learn\new\pj1\pythonProject\.venv\src\node_modules\webdriver\chromedriver.exe")  # 修改为正确的 chromedriver 路径


def fetch_new_cookies(username, password):
    logging.info("#Starting to fetch new cookies...")
    options = Options()
    options.add_argument("--headless")  # Headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    chromedriver_path = r"/usr/bin/chromedriver"
    service = Service(chromedriver_path)
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get("https://authserver.jsei.edu.cn/authserver/login?service=https%3A%2F%2Fjwpd.jsei.edu.cn%2Fsso%2Fjznewsixlogin")
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))

        # Enter username and password
        logging.info("#Entering username and password...")
        driver.find_element(By.ID, "username").send_keys(username)
        driver.find_element(By.ID, "password").send_keys(password)
        driver.find_element(By.CLASS_NAME, "auth_login_btn").click()

        # Wait for redirection
        WebDriverWait(driver, 15).until(EC.url_contains("jwpd.jsei.edu.cn"))

        # Get new cookies
        cookies_string = get_cookies_with_retries(driver)

        # Save cookies to file
        save_cookies_to_file(username, password, cookies_string)
    finally:
        driver.quit()

    return cookies_string



is_processing = False  # 控制并发请求



# Socket.IO 处理客户端连接
@socketio.on('connect')
def handle_connect():
    logging.info("#Client connected")
    socketio.emit('message', 'Server connected successfully')

# 处理客户端断开连接
@socketio.on('disconnect')
def handle_disconnect():
    logging.info("#Client disconnected")




# 处理 get-data 请求
@socketio.on('get-data')
def handle_get_data(data):
    global is_processing, weekNumber

    if is_processing:
        logging.warning("!!!Server is busy, please try again later")
        socketio.emit('error', {"error": "Server is busy, please try again later"})
        return

    is_processing = True
    username = data.get("username")
    password = data.get("password")
    weekNumber = data.get("weekNumber")
    request_tag = data.get("tag")  # 获取标签
    logging.info(f"#User submitted request, username: {username}, password: {password}, week number: {weekNumber}")

    if not username or not password:
        is_processing = False
        logging.error("!!!Username and password cannot be empty")
        socketio.emit('error', {"error": "Username and password cannot be empty"})
        return

    try:
        # 验证用户名和密码并获取 Cookies
        cookies_string = validate_and_get_cookies(username, password)
        headers = {"Cookie": cookies_string}
        logging.info(f"#Successfully retrieved cookies, requesting data for week {weekNumber}")

        # 获取课程数据
        response_data = fetch_data_with_retries(headers)

        # 将数据打上标签
        tagged_response = {
            "tag": request_tag,   # 包含请求的标签
            "data": response_data  # 服务器返回的实际数据
        }

        # 返回数据给客户端
        socketio.emit('data-response', tagged_response)
        logging.info(f"#Data for week {weekNumber} successfully returned with tag: {request_tag}")

    except Exception as error:
        logging.error(f"!!!An error occurred: {error}")
        socketio.emit('error', {"error": "Request failed", "details": str(error)})

    finally:
        is_processing = False





if __name__ == '__main__':
    logging.info("#Socket.IO application starting...")
    socketio.run(app, host='0.0.0.0', port=2345, allow_unsafe_werkzeug=True)


