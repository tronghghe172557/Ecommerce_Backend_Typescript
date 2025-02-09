<h1>Design Factory Pattern trong Node.js</h1>
<h2>Giới thiệu</h2>

<p>Factory Pattern (Mẫu thiết kế Nhà máy) là một trong những mẫu thiết kế sáng tạo phổ biến trong lập trình hướng đối tượng. Nó cho phép tạo ra các đối tượng mà không cần chỉ ra Class cụ thể của chúng. Thay vào đó, một Class Factory sẽ chịu trách nhiệm tạo ra các đối tượng dựa trên tham số đầu vào.</p>

<h2>Chúng ta sẽ quan tâm ở file product.service.js</h2>
<h3> 3 Class cần lưu ý: </h3>
<ul>
    <li>Triển khai Class <strong>ProductFactory</strong> </li>
    <li>Class cha (Class cơ sở) <strong>Product</strong></li>
    <li>Class con <strong>Clothing and Electronic</strong></li>
</ul>

<h2>Ý nghĩa của các Class</h2>
<p>Class cơ sở Product: Class cha cho các loại sản phẩm cụ thể.</p>
<p>Các Class con: Clothing và Electronic, kế thừa từ Product và triển khai phương thức createProduct riêng của chúng.
    </br> Kế thừa từ Product: Cả hai lớp Clothing và Electronic kế thừa các thuộc tính và phương thức từ lớp cha Product.
    </br> Ghi đè phương thức createProduct: Mỗi lớp con triển khai phương thức createProduct riêng, bao gồm việc tạo các thuộc tính đặc trưng và sau đó gọi phương thức của lớp cha để tạo sản phẩm chung.

</p>
