import request from '@/utils/requestUser'

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
    method: 'post',
    headers: {
      isToken: true
    }
  })
}

//  获取用户信息
export function getUserInfo() {
  return request ({
    url: '/user/current',
    method: 'get',
    headers: {
     isToken: true
    }
  })
}

// 保存用户信息
export function savaUserInfo(userinfo) {
  return request({
    url: '/user/saveUserInfo',
    method: 'put',
    headers: {
      isToken: true
    },
    data: userinfo
  })
}


//  获取其他用户信息
export function getOtherUser(userId) {
  return request ({
    url: '/user/getOtherUser/' + userId,
    method: 'get',
    headers: {
      isToken: true
    }
  })
}

//  发送邮箱验证码
export function sendMailCaptcha(query) {
  return request ({
    url: '/mail/sendVerifyMailCaptcha',
    method: 'get',
    headers: {
      isToken: true
    },
    params: query
  })
}

//  邮箱验证
export function verifyMail(query) {
  return request ({
    url: '/mail/verifyMail',
    method: 'post',
    headers: {
      isToken: true
    },
    params: query
  })
}

//  发送找回账号验证码
export function sendRetrieveAccountCaptcha(query) {
  return request ({
    url: '/mail/sendRetrieveAccountCaptcha',
    method: 'get',
    headers: {
      isToken: false
    },
    params: query
  })
}

//  找回账号
export function retrieveAccount(query) {
  return request ({
    url: '/mail/retrieveAccount',
    method: 'get',
    headers: {
      isToken: false
    },
    params: query
  })
}

//  发送忘记密码验证码
export function sendUpdatePasswordCaptcha(query) {
  return request ({
    url: '/mail/sendUpdatePasswordCaptcha',
    method: 'get',
    headers: {
      isToken: false
    },
    params: query
  })
}
