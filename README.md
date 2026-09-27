HỆ THỐNG QUẢN LÝ KHO HÀNG (INVENTORY MANAGEMENT SYSTEM)

Môn học: Triển khai và Quản trị Hệ thống Phần mềm
Sinh viên: NGÔ QUANG MINH
Mã sinh viên: DTC245160017
Lớp: KHMT K23A

1. Giới thiệu

Đây là đề tài thực hành Hệ thống Quản lý Kho Hàng (Inventory) được triển khai theo mô hình container hóa bằng Docker Compose.

Hệ thống hỗ trợ các chức năng chính:

Quản lý sản phẩm.

Quản lý nhà cung cấp.

Nhập kho.

Xuất kho.

Theo dõi số lượng tồn kho.

Theo dõi lịch sử nhập/xuất hàng.

Quản trị cơ sở dữ liệu bằng phpMyAdmin.

Reverse Proxy bằng Nginx.

Giám sát hệ thống bằng Prometheus + Grafana.

Thu thập và truy vấn log tập trung bằng Loki + Promtail + LogQL.

Áp dụng các biện pháp hardening cơ bản cho hệ thống.

Toàn bộ ứng dụng và các dịch vụ liên quan được triển khai bằng Docker Compose.

2. Kiến trúc hệ thống

                         USER / BROWSER
                               |
                               v
                        +-------------+
                        |    NGINX    |
                        |    :80      |
                        +------+------+
                               |
                       Reverse Proxy
                               |
                               v
                        +-------------+
                        | Inventory   |
                        | Node.js App |
                        |    :3000    |
                        +------+------+
                               |
                               v
                        +-------------+
                        |    MySQL    |
                        |    :3306    |
                        +------+------+
                               |
                               v
                        +-------------+
                        | phpMyAdmin  |
                        |    :8080    |
                        +-------------+


        MONITORING                          CENTRALIZED LOGGING
+--------------------------+              +----------------------+
| cAdvisor                 |              | Docker/App/Nginx log |
| Nginx Exporter           |              +----------+-----------+
| MySQL Exporter           |                         |
+------------+-------------+                         v
             |                                    Promtail
             v                                       |
        Prometheus                                   v
             |                                      Loki
             v                                       |
          Grafana <----------------------------------+

Luồng hoạt động

Người dùng truy cập website thông qua Nginx.

Nginx thực hiện reverse proxy request đến container ứng dụng.

Ứng dụng Node.js/Express kết nối đến MySQL trong Docker network nội bộ.

phpMyAdmin được sử dụng để quản trị cơ sở dữ liệu.

Prometheus thu thập metrics của container, web server và database.

Grafana hiển thị dashboard giám sát.

Promtail thu thập log và gửi về Loki.

Log được truy vấn bằng LogQL trong Grafana.

3. Công nghệ sử dụng

Thành phần

Công nghệ

Web Application

Node.js + Express

Template/UI

EJS + HTML + CSS

Database

MySQL 8

Database Management

phpMyAdmin

Reverse Proxy

Nginx

Containerization

Docker

Orchestration

Docker Compose

Monitoring

Prometheus

Dashboard

Grafana

Container Metrics

cAdvisor

Web Metrics

Nginx Exporter

Database Metrics

MySQL Exporter

Centralized Logging

Loki

Log Collector

Promtail

Log Query

LogQL

Version Control

Git + GitHub

Deployment Environment

Ubuntu Linux trên VMware Workstation Pro

4. Chức năng hệ thống

4.1. Quản lý sản phẩm

Xem danh sách sản phẩm.

Thêm sản phẩm.

Xóa sản phẩm.

Quản lý mã SKU.

Quản lý giá.

Theo dõi số lượng tồn kho.

Liên kết sản phẩm với nhà cung cấp.

4.2. Quản lý nhà cung cấp

Xem danh sách nhà cung cấp.

Thêm nhà cung cấp.

Xóa nhà cung cấp.

Quản lý tên, số điện thoại, email và địa chỉ.

4.3. Nhập kho

Chọn sản phẩm.

Nhập số lượng.

Ghi nhận giao dịch IMPORT.

Tự động tăng số lượng tồn kho.

4.4. Xuất kho

Chọn sản phẩm.

Nhập số lượng xuất.

Ghi nhận giao dịch EXPORT.

Tự động giảm tồn kho.

Không cho phép xuất vượt quá số lượng đang tồn.

4.5. Lịch sử giao dịch

Hệ thống lưu lại:

Sản phẩm.

Loại giao dịch.

Số lượng.

Ghi chú.

Thời gian thực hiện.

5. Cấu trúc thư mục

inventory-management-system/
|
├── app/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   ├── productRoutes.js
│   │   │   ├── supplierRoutes.js
│   │   │   └── inventoryRoutes.js
│   │   ├── views/
│   │   │   ├── products/
│   │   │   ├── suppliers/
│   │   │   ├── inventory/
│   │   │   └── dashboard.ejs
│   │   ├── public/
│   │   │   └── css/
│   │   │       └── style.css
│   │   └── server.js
│   ├── package.json
│   └── Dockerfile
│
├── mysql/
│   └── init.sql
│
├── nginx/
│   └── nginx.conf
│
├── prometheus/
│   └── prometheus.yml
│
├── grafana/
│   └── provisioning/
│
├── loki/
│   └── loki-config.yml
│
├── promtail/
│   └── promtail-config.yml
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

6. Yêu cầu môi trường

Máy triển khai cần có:

docker --version
docker compose version
git --version

Môi trường sử dụng trong bài:

VMware Workstation Pro.

Ubuntu Linux VM.

Docker Engine.

Docker Compose.

Git.

7. Clone repository

git clone [LINK_GITHUB_REPOSITORY]

Đi vào thư mục dự án:

cd inventory-management-system

8. Cấu hình biến môi trường

Sao chép file mẫu:

cp .env.example .env

Sau đó sửa:

nano .env

Ví dụ:

MYSQL_ROOT_PASSWORD=CHANGE_TO_STRONG_PASSWORD
MYSQL_DATABASE=inventory_db
MYSQL_USER=inventory_user
MYSQL_PASSWORD=CHANGE_TO_STRONG_PASSWORD

DB_HOST=mysql
DB_PORT=3306
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASSWORD=CHANGE_TO_STRONG_PASSWORD

GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=CHANGE_TO_STRONG_PASSWORD

Lưu ý bảo mật: Không commit file .env lên GitHub. Repository chỉ lưu .env.example.

9. Khởi chạy hệ thống

Kiểm tra cấu hình Docker Compose:

docker compose config

Build và chạy:

docker compose up -d --build

Kiểm tra trạng thái:

docker compose ps

Các container chính phải ở trạng thái Up hoặc healthy.

10. Truy cập các dịch vụ

Thay SERVER_IP bằng địa chỉ IP của Ubuntu VM.

Lấy IP:

hostname -I

Dịch vụ

Địa chỉ

Inventory Website

http://SERVER_IP

phpMyAdmin

http://SERVER_IP:8080

Grafana

http://SERVER_IP:3000 hoặc port được cấu hình trong Docker Compose

Prometheus

http://SERVER_IP:9090

Sau khi Nginx được cấu hình, người dùng truy cập Inventory Website qua Nginx và không truy cập trực tiếp port nội bộ của ứng dụng.

11. Kiểm tra ứng dụng và Database

Health Check

curl http://localhost/health

Kết quả mong đợi:

{
  "status": "healthy",
  "database": "connected"
}

Kiểm tra MySQL

docker exec -it inventory_mysql mysql -u inventory_user -p

Sau đó:

USE inventory_db;
SHOW TABLES;

Các bảng chính:

suppliers
products
inventory_transactions

12. Nginx Reverse Proxy

Luồng truy cập:

Browser
   |
   v
Nginx :80
   |
   v
Inventory App :3000

Kiểm tra cú pháp:

docker exec inventory_nginx nginx -t

Kết quả mong đợi:

syntax is ok
test is successful

Kiểm tra reverse proxy:

curl http://localhost

Kiểm tra health endpoint qua Nginx:

curl http://localhost/health

13. Security Headers Nginx

Hệ thống cấu hình các HTTP security headers cơ bản:

X-Frame-Options
X-Content-Type-Options
Referrer-Policy
Permissions-Policy

Kiểm tra:

curl -I http://localhost

Ví dụ kết quả:

X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()

14. Prometheus Monitoring

Prometheus được sử dụng để thu thập metrics từ các thành phần:

Docker/container.

Nginx.

MySQL.

Các exporter có thể gồm:

cAdvisor
Nginx Exporter
MySQL Exporter

Kiểm tra Prometheus:

http://SERVER_IP:9090

Vào:

Status -> Targets

Các target cần ở trạng thái:

UP

15. Grafana Dashboard

Grafana được sử dụng để trực quan hóa dữ liệu từ Prometheus.

Dashboard cần thể hiện tối thiểu các nhóm thông tin:

CPU container.

RAM container.

Network container.

Trạng thái container.

Metrics Nginx.

Metrics MySQL.

Truy cập:

http://SERVER_IP:3000

Nếu Grafana sử dụng port khác trong docker-compose.yml, truy cập theo port đã cấu hình.

16. Loki + Promtail

Luồng logging:

Application / Nginx / Docker Logs
                |
                v
             Promtail
                |
                v
               Loki
                |
                v
         Grafana Explore

Promtail chịu trách nhiệm thu thập log và gửi đến Loki.

Loki chịu trách nhiệm lưu trữ và truy vấn log.

17. LogQL

Trong Grafana:

Explore -> Loki

Một số truy vấn LogQL sử dụng để demo:

Query 1 - Xem log ứng dụng

{container="inventory_app"}

Query 2 - Tìm lỗi trong ứng dụng

{container="inventory_app"} |= "error"

Query 3 - Xem log Nginx

{container="inventory_nginx"}

Tên label thực tế cần khớp với cấu hình Promtail/Loki của hệ thống.

18. Hardening hệ thống

Hệ thống áp dụng các biện pháp bảo mật sau:

18.1. Không lưu mật khẩu trong GitHub

File:

.env

được thêm vào:

.gitignore

Repository chỉ lưu:

.env.example

18.2. Sử dụng mật khẩu mạnh

MySQL và Grafana sử dụng mật khẩu được cấu hình qua biến môi trường.

18.3. Hạn chế quyền Database

Ứng dụng sử dụng tài khoản:

inventory_user

thay vì sử dụng trực tiếp tài khoản root.

18.4. Network Isolation

Docker network được tách thành:

frontend
backend
monitoring

Nguyên tắc:

Nginx -> frontend
App   -> frontend + backend
MySQL -> backend

Nginx không cần truy cập trực tiếp MySQL.

18.5. Không public trực tiếp port ứng dụng

Ứng dụng Node.js chỉ expose port nội bộ.

Người dùng truy cập thông qua:

Nginx :80

18.6. Security Headers

Nginx bổ sung các HTTP security headers cơ bản.

18.7. Non-root Container

Container ứng dụng được cấu hình chạy bằng user không phải root sau khi hoàn thiện hardening.

19. Kiểm tra Docker Network

Danh sách network:

docker network ls

Kiểm tra frontend:

docker network inspect inventory-management-system_frontend

Kiểm tra backend:

docker network inspect inventory-management-system_backend

20. Kiểm tra log container

Xem toàn bộ log:

docker compose logs

Theo dõi log:

docker compose logs -f

Log ứng dụng:

docker logs inventory_app

Log Nginx:

docker logs inventory_nginx

Log MySQL:

docker logs inventory_mysql

21. Dừng hệ thống

docker compose down

Nếu muốn build lại:

docker compose down
docker compose up -d --build

Không dùng docker compose down -v nếu muốn giữ dữ liệu MySQL trong Docker volume.

22. Quy trình demo đề tài

Có thể demo theo thứ tự sau:

Mở GitHub Repository.

Giới thiệu cấu trúc source và các file cấu hình.

Chạy:

docker compose up -d --build

Kiểm tra:

docker compose ps

Truy cập Inventory Website qua Nginx.

Thêm nhà cung cấp.

Thêm sản phẩm.

Nhập kho.

Xuất kho.

Kiểm tra tồn kho.

Kiểm tra dữ liệu bằng phpMyAdmin.

Kiểm tra security headers bằng curl -I.

Mở Prometheus và kiểm tra Targets.

Mở Grafana và trình bày dashboard.

Mở Grafana Explore và chạy ít nhất 2-3 truy vấn LogQL.

Trình bày các biện pháp hardening.

23. Kiểm tra kết quả nghiệp vụ

Ví dụ:

Sản phẩm: Laptop Dell
Tồn ban đầu: 0

Nhập kho: 10
=> Tồn kho: 10

Xuất kho: 3
=> Tồn kho: 7

Nếu thử xuất:

20

khi kho chỉ còn:

7

hệ thống phải từ chối giao dịch để tránh tồn kho âm.

24. Các commit quan trọng

Repository cần có các commit rõ ràng, có ý nghĩa.

Ví dụ:

feat: initialize inventory application and MySQL
fea
t: configure nginx reverse proxy and security headers
feat: integrate prometheus and grafana monitoring
feat: integrate loki and promtail centralized logging
security: apply container and database hardening
docs: complete README and deployment instructions

Các mốc quan trọng theo yêu cầu triển khai:

Commit 1: Nginx Reverse Proxy
Commit 2: Prometheus + Grafana
Commit 3: Loki + Promtail

25. Tiêu chí hoàn thành

Source code và file cấu hình đầy đủ trên GitHub.

README hướng dẫn chạy hệ thống rõ ràng.

Có tối thiểu 03 commit có ý nghĩa.

Website Inventory chạy ổn định.

Kết nối MySQL thành công.

phpMyAdmin hoạt động.

Website được truy cập qua Nginx Reverse Proxy.

Có security headers hoặc HTTPS.

Prometheus thu thập metrics.

Grafana có dashboard container/web/database.

Loki + Promtail hoạt động.

Có ít nhất 2-3 truy vấn LogQL.

Có ít nhất 3-4 biện pháp hardening.

Toàn bộ hệ thống chạy bằng Docker Compose.

Có screenshot/minh chứng cho báo cáo.

Có thể giải thích rõ chức năng của từng thành phần.

26. Kết luận

Hệ thống Inventory được xây dựng và triển khai theo mô hình container hóa với Docker Compose, tích hợp đầy đủ các thành phần ứng dụng, cơ sở dữ liệu, reverse proxy, monitoring, centralized logging và hardening.

Kiến trúc này giúp hệ thống dễ triển khai, quản lý, theo dõi và mở rộng, đồng thời đáp ứng các yêu cầu của bài thực hành môn Triển khai và Quản trị Hệ thống Phần mềm.
