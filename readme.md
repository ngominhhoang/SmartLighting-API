# API SmartLighting

API SmartLighting được sử dụng để giao tiếp giữa client và database, cùng với các thiết bị thông minh trong nhà

### Công nghệ

API SmartLighting được phát triển cùng với một số module:

* [ExpressJS](http://expressjs.com/)
* [Bcrypt](https://www.npmjs.com/package/bcrypt-nodejs)
* [MQTT](https://mqtt.org/)
* [JSON Web Token](https://www.jsonwebtoken.io/)
* [node.js](https://nodejs.org/en/)
* [MySQL](https://www.mysql.com/)

### Cài đặt

API SmartLighting chạy trên nền [Node.js](https://nodejs.org/)

Trước tiên cần phải cài Node.js và npm từ trang chủ của Node.js. Sau khi đã cài đặt thành công, ta có thể kiểm tra version của Node.js và npm để xem xem đã có Node.js và npm trong máy chưa bằng câu lệnh:

```sh
$ npm -v
$ node -v
```

Nếu không chạy được 2 câu lệnh trên thì phải cài đặt  lại Node.js và npm

Clone respository ở trên với Git Bash (API luôn được update ở đây)

```sh
$ git clone https://gitlab.com/smart-lightning/smartlight-api.git
```

Cài đặt module:

```sh
$ cd smartlight-api
$ npm install
```

Tạo file .env (hoặc sửa file .env.example thành .env) khai báo thông số kết nối Database:
```sh
NODE_ENV=development

DB_HOST= {địa chỉ server mysql}
DB_USER= {username}
DB_PASS= {password}
DB_TABLE= smart_lighting

MQTT_ADD={địa chỉ broker}
```

Chạy API:

```sh
$ cd smartlight-api
$ node app.js
```

Bổ sung: Chạy API liên tục  không cần phải  chạy lại lệnh node app.js sau khi sửa code:

```sh
$ cd smartlight-api
$ npm install -g nodemon
$ nodemon app.js
```

### Documents:

Địa chỉ deploy server hiện tại:
```sh
http://k61iotlab.ddns.net:3000 (HTTP)
```
```sh
https://k61iotlab.ddns.net:3001 (HTTPS)
```
[API Docs:](https://k61iotlab.ddns.net/apidoc) (Hoặc copy link dưới dán vào trình duyệt)
```sh
https://k61iotlab.ddns.net/apidoc
```
