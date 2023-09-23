import request from '@/utils/request2'

// 登录
export function userLogin(username,password,captcha,uuid) {
  return request({
    url: '/user/login',
    method: 'post',
    headers: {
      isToken: false
    },
    data: {"username":username,'password':password,'captcha':captcha,'uuid':uuid}
  })
}

// 获取图片验证码
export function getCaptchaImage() {
  return request({
    url: '/user/captchaImage',
    method: 'get',
    headers: {
      isToken: false
    }
  })
}

 // 用户注册
export function userRegister(username,nickName,email,password) {
    return request({
        url: '/user/register',
        method: 'post',
        headers: {
            isToken :false
        },
        data: {"username":username,"nickName":nickName,"email":email,"password":password}
    })
}

// 用户登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

//  获取用户信息
export function getUserInfo() {
  return request ({
    url: '/user/current',
    method: 'get',
  })
}

// 保存用户信息
export function savaUserInfo(userinfo) {
  return request({
    url: '/user/saveUserInfo',
    method: 'put',
    data: userinfo
  })
}
