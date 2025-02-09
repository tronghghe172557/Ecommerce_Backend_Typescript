Tài liệu: Lỗi "Cast to ObjectId failed" khi sử dụng findByIdAndDelete
Mô tả lỗi
Khi cố gắng xóa một bản ghi khỏi cơ sở dữ liệu MongoDB bằng Mongoose, bạn gặp phải lỗi sau:

Nguyên nhân
Lỗi này xảy ra khi bạn sử dụng phương thức findByIdAndDelete với một tham số không phải là ObjectId. Trong đoạn mã hiện tại, bạn đang truyền một đối tượng thay vì một ObjectId:

Phương thức findByIdAndDelete yêu cầu một ObjectId hoặc chuỗi đại diện cho ObjectId làm tham số đầu vào, nhưng ở đây bạn đang truyền vào một đối tượng { user: userId }.

Giải pháp
Thay vì sử dụng findByIdAndDelete, bạn nên sử dụng findOneAndDelete với một bộ lọc (filter) để xóa tài liệu dựa trên trường user.

Sửa lại phương thức deleteKeyByUserId như sau:

    static deleteKeyByUserId = async (userId) => {
        return await keytokenModel.findOneAndDelete( {user: userId } 
    )

}

Giải thích
findByIdAndDelete(id): Tìm và xóa một tài liệu dựa trên trường \_id bằng id được cung cấp.
findOneAndDelete(filter): Tìm và xóa một tài liệu đầu tiên khớp với bộ lọc filter.
Trong trường hợp này, bạn muốn xóa tài liệu có trường user bằng userId, do đó sử dụng findOneAndDelete là phù hợp.

Kết luận
Bằng cách thay đổi phương thức từ findByIdAndDelete sang findOneAndDelete và sử dụng bộ lọc đúng, bạn sẽ khắc phục được lỗi "Cast to ObjectId failed".
