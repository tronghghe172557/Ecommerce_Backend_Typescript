type Role = 'SHOP' | 'WRITER' | 'EDITOR' | 'ADMIN'

/*
    Record<K, V> tạo ra một object với key là kiểu K và value là kiểu V
    Key có kiểu K (phải là kiểu string | number | symbol).

*/
const roleShop: Record<Role, Role> = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

export default roleShop
