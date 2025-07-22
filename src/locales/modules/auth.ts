/**
 * 认证模块语言配置
 */
import type { AuthLocaleMessages } from '../types'

/** 中文配置 */
export const authZhCN: AuthLocaleMessages = {
  login: {
    title: '用户登录',
    username: '用户名',
    password: '密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码',
    loginButton: '登录',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    invalidCredentials: '用户名或密码错误',
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码',
  },

  logout: {
    title: '退出登录',
    confirm: '确定要退出登录吗？',
    success: '已退出登录',
    failed: '退出登录失败',
  },

  register: {
    title: '用户注册',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    email: '邮箱',
    phone: '手机号',
    agreement: '我已阅读并同意用户协议',
    registerButton: '注册',
    registerSuccess: '注册成功',
    registerFailed: '注册失败',
    userExists: '用户名已存在',
    emailExists: '邮箱已被使用',
  },
}

/** 英文配置 */
export const authEnUS: AuthLocaleMessages = {
  login: {
    title: 'User Login',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password',
    loginButton: 'Login',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    invalidCredentials: 'Invalid username or password',
    usernameRequired: 'Please enter username',
    passwordRequired: 'Please enter password',
  },

  logout: {
    title: 'Logout',
    confirm: 'Are you sure you want to logout?',
    success: 'Logged out successfully',
    failed: 'Logout failed',
  },

  register: {
    title: 'User Registration',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    phone: 'Phone',
    agreement: 'I have read and agree to the user agreement',
    registerButton: 'Register',
    registerSuccess: 'Registration successful',
    registerFailed: 'Registration failed',
    userExists: 'Username already exists',
    emailExists: 'Email already in use',
  },
}

/** 繁体中文配置 */
export const authZhTW: AuthLocaleMessages = {
  login: {
    title: '用戶登入',
    username: '用戶名',
    password: '密碼',
    rememberMe: '記住我',
    forgotPassword: '忘記密碼',
    loginButton: '登入',
    loginSuccess: '登入成功',
    loginFailed: '登入失敗',
    invalidCredentials: '用戶名或密碼錯誤',
    usernameRequired: '請輸入用戶名',
    passwordRequired: '請輸入密碼',
  },

  logout: {
    title: '登出',
    confirm: '確定要登出嗎？',
    success: '已登出',
    failed: '登出失敗',
  },

  register: {
    title: '用戶註冊',
    username: '用戶名',
    password: '密碼',
    confirmPassword: '確認密碼',
    email: '電子郵件',
    phone: '手機號碼',
    agreement: '我已閱讀並同意用戶協議',
    registerButton: '註冊',
    registerSuccess: '註冊成功',
    registerFailed: '註冊失敗',
    userExists: '用戶名已存在',
    emailExists: '電子郵件已被使用',
  },
}

/** 日文配置 */
export const authJaJP: AuthLocaleMessages = {
  login: {
    title: 'ユーザーログイン',
    username: 'ユーザー名',
    password: 'パスワード',
    rememberMe: 'ログイン状態を保持',
    forgotPassword: 'パスワードを忘れた',
    loginButton: 'ログイン',
    loginSuccess: 'ログイン成功',
    loginFailed: 'ログイン失敗',
    invalidCredentials: 'ユーザー名またはパスワードが間違っています',
    usernameRequired: 'ユーザー名を入力してください',
    passwordRequired: 'パスワードを入力してください',
  },

  logout: {
    title: 'ログアウト',
    confirm: 'ログアウトしてもよろしいですか？',
    success: 'ログアウトしました',
    failed: 'ログアウトに失敗しました',
  },

  register: {
    title: 'ユーザー登録',
    username: 'ユーザー名',
    password: 'パスワード',
    confirmPassword: 'パスワード確認',
    email: 'メールアドレス',
    phone: '電話番号',
    agreement: 'ユーザー規約に同意します',
    registerButton: '登録',
    registerSuccess: '登録成功',
    registerFailed: '登録失敗',
    userExists: 'ユーザー名は既に存在します',
    emailExists: 'メールアドレスは既に使用されています',
  },
}
