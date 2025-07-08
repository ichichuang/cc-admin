declare interface UserInfo {
  /** 用户ID */
  userId: string
  /** 用户名 */
  username: string
  /** 用户角色 */
  roles: string[]
  /** 用户权限 */
  permissions: string[]
  /** 其他用户信息 */
  [key: string]: any
}
