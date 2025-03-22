/**
 * Chuyển đổi một đối tượng lồng nhau thành một đối tượng phẳng hơn.
 * @param obj - Đối tượng hoặc mảng cần chuyển đổi.
 * @returns Đối tượng phẳng hơn với các khóa đại diện cho đường dẫn đến các giá trị trong đối tượng ban đầu.
 *
 * @example
 * const obj = {
 *   product_name: "update-product",
 *   product_thumbnail: "update-product",
 *   product_description: "update-product",
 *   product_price: 12345678,
 *   product_quantity: 123456789,
 *   product_type: "Clothing",
 *   product_attribute: {
 *     brand: "update-product",
 *     size: "update-product 1"
 *   }
 * };
 *
 * const result = updateNestedObjectParse(obj);
 * console.log(result);
 *
 * Kết quả:
 * {
 *   "product_name": "update-product",
 *   "product_thumbnail": "update-product",
 *   "product_description": "update-product",
 *   "product_price": 12345678,
 *   "product_quantity": 123456789,
 *   "product_type": "Clothing",
 *   "product_attribute.brand": "update-product",
 *   "product_attribute.size": "update-product 1"
 * }
 */
export const updateNestedObjectParse = <T extends Record<string, unknown>>(obj: T): Record<string, unknown> => {
  const final: Record<string, unknown> = {}

  // Duyệt qua tất cả các key trong đối tượng đầu vào.
  Object.keys(obj || {}).forEach((k: string) => {
    const value = obj[k]

    // Kiểm tra nếu giá trị là một đối tượng không phải mảng.
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Đệ quy để làm phẳng đối tượng lồng nhau.
      const response = updateNestedObjectParse(value as Record<string, unknown>)

      // Kết hợp các kết quả của đối tượng lồng nhau vào đối tượng final.
      Object.keys(response || {}).forEach((a: string) => {
        final[`${k}.${a}`] = response[a]
      })
    } else {
      // Nếu không phải đối tượng lồng nhau, thêm nó vào final.
      final[k] = value
    }
  })

  return final
}
