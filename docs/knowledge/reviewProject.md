# 1. Khía cạnh	Ưu điểm	Nhược điểm / Cần cải thiện Kiến trúc phần mềm

- Có thể thiếu phần cấu hình khởi tạo ứng dụng chung (ví dụ thiếu file khởi tạo server chính hoặc DI).
- Chưa rõ có dùng pattern phổ biến (như Dependency Injection) để swap đổi linh hoạt các thành phần.

# 2. REST API	
- Đường dẫn API cần nhất quán dùng danh từ và phân mảng (theo khuyến cáo “Use nouns instead of verbs” [Best practices for REST API design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/))

- Thiếu các tính năng tiện ích như phân trang, phân loại, lọc (filter/sort) khi truy vấn danh sách lớn, chưa áp dụng giải pháp cache hoặc index cơ sở dữ liệu dẫn đến nguy cơ tắc nghẽn khi dữ liệu nhiều.

# 3. RabbitMQ
- Cần đảm bảo xử lý xác nhận (ack) và trường hợp lỗi khi consumer không xử lý được message. RabbitMQ khuyến cáo phải ack sau khi xử lý xong, hoặc nack/requeue khi lỗi để đảm bảo tin nhắn không mất
- Nếu đang mở kết nối mỗi lần gửi, nên thay bằng kết nối lâu dài và sử dụng nhiều channel cho đa luồng
[cloudamqp](https://www.cloudamqp.com/blog/part1-rabbitmq-best-practice.html#:~:text=called%20channels%20that%20%E2%80%9Cmultiplexes%E2%80%9D%20a,involved%20and%20requires%20at%20least)
- Chưa rõ có sử dụng durable queues hay persistent messages. Nên kích hoạt durable nếu cần bảo toàn dữ liệu qua restart.

# 4. Clean code	
- Cần chú ý đặt tên biến/hàm rõ ràng, tránh viết tắt khó hiểu. Biến toàn cục hay tài nguyên nhạy cảm không nên hardcode.
- Nên tuân thủ nguyên tắc DRY (Don't Repeat Yourself): trừ lặp code, tránh viết cùng logic nhiều lần (ví dụ validate đầu vào, xử lý lỗi).
- Không nên để code chết hoặc console.log ở nơi production. Dùng eslint để bắt lỗi tiềm ẩn.

# 5. Tối ưu hiệu suất	
- Cần cache kết quả truy vấn hay static nếu có thể. Express gợi ý nên bật cache khi NODE_ENV=production
[expressjs.com](https://expressjs.com/en/advanced/best-practice-performance.html#:~:text=The%20NODE_ENV%20environment%20variable%20specifies,production)
.
- Sử dụng clustering để tận dụng nhiều CPU (như PM2 cluster mode)
[expressjs.com](https://expressjs.com/en/advanced/best-practice-performance.html#:~:text=The%20NODE_ENV%20environment%20variable%20specifies,production)
.
- Tránh các hàm đồng bộ/blocking (ví dụ đọc ghi file không dùng async) vì có thể block event loop
dev.to
.
- Áp dụng phân trang (limit, skip) và chỉ select trường cần thiết.