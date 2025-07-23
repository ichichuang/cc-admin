/**
 * 用户模块语言配置
 */
import type { UserLocaleMessages } from '../types'

/** 中文配置 */
export const userZhCN: UserLocaleMessages = {
  profile: {
    title: '个人资料',
    basicInfo: '基本信息',
    avatar: '头像',
    username: '用户名',
    email: '邮箱',
    phone: '手机号',
    department: '部门',
    role: '角色',
    lastLogin: '最后登录',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    updateSuccess: '更新成功',
    updateFailed: '更新失败',
  },

  management: {
    title: '用户管理',
    userList: '用户列表',
    addUser: '添加用户',
    editUser: '编辑用户',
    deleteUser: '删除用户',
    deleteConfirm: '确定要删除用户 {username} 吗？',
    batchDelete: '批量删除',
    exportUsers: '导出用户',
    importUsers: '导入用户',
    userCount: '用户总数',
    searchUser: '搜索用户',
    filterByRole: '按角色筛选',
    filterByStatus: '按状态筛选',
  },

  roles: {
    admin: '管理员',
    user: '普通用户',
    guest: '访客',
    moderator: '版主',
    editor: '编辑',
    viewer: '查看者',
  },

  status: {
    active: '正常',
    inactive: '非活跃',
    banned: '已封禁',
    pending: '待审核',
    suspended: '已暂停',
  },
}

/** 英文配置 */
export const userEnUS: UserLocaleMessages = {
  profile: {
    title: 'User Profile',
    basicInfo: 'Basic Information',
    avatar: 'Avatar',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    department: 'Department',
    role: 'Role',
    lastLogin: 'Last Login',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    updateSuccess: 'Update successful',
    updateFailed: 'Update failed',
  },

  management: {
    title: 'User Management',
    userList: 'User List',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    deleteConfirm: 'Are you sure you want to delete user {username}?',
    batchDelete: 'Batch Delete',
    exportUsers: 'Export Users',
    importUsers: 'Import Users',
    userCount: 'Total Users',
    searchUser: 'Search Users',
    filterByRole: 'Filter by Role',
    filterByStatus: 'Filter by Status',
  },

  roles: {
    admin: 'Administrator',
    user: 'User',
    guest: 'Guest',
    moderator: 'Moderator',
    editor: 'Editor',
    viewer: 'Viewer',
  },

  status: {
    active: 'Active',
    inactive: 'Inactive',
    banned: 'Banned',
    pending: 'Pending',
    suspended: 'Suspended',
  },
}

/** 繁体中文配置 */
export const userZhTW: UserLocaleMessages = {
  profile: {
    title: '個人資料',
    basicInfo: '基本資訊',
    avatar: '頭像',
    username: '用戶名',
    email: '電子郵件',
    phone: '手機號碼',
    department: '部門',
    role: '角色',
    lastLogin: '最後登入',
    createdAt: '創建時間',
    updatedAt: '更新時間',
    updateSuccess: '更新成功',
    updateFailed: '更新失敗',
  },

  management: {
    title: '用戶管理',
    userList: '用戶列表',
    addUser: '新增用戶',
    editUser: '編輯用戶',
    deleteUser: '刪除用戶',
    deleteConfirm: '確定要刪除用戶 {username} 嗎？',
    batchDelete: '批量刪除',
    exportUsers: '匯出用戶',
    importUsers: '匯入用戶',
    userCount: '用戶總數',
    searchUser: '搜尋用戶',
    filterByRole: '按角色篩選',
    filterByStatus: '按狀態篩選',
  },

  roles: {
    admin: '管理員',
    user: '普通用戶',
    guest: '訪客',
    moderator: '版主',
    editor: '編輯',
    viewer: '查看者',
  },

  status: {
    active: '正常',
    inactive: '非活躍',
    banned: '已封禁',
    pending: '待審核',
    suspended: '已暫停',
  },
}
