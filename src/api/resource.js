import request from '@/utils/requestBlog'

const API_PREFIX = '/resource'


// 上传文章图片
export function uploadImage(formData) {
  return request({
    url: API_PREFIX+'/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Dispositon': 'inline', //设置应答方式为内联
      isToken: true
    }
  })
}

// 删除文章图片
export function deleteImage(url) {
  return request({
    url: API_PREFIX+'/deleteImage',
    method: 'delete',
    params: url,
    headers: {
      isToken: true
    }
  })
}

// 上传头像
export function uploadAvatar(formData) {
  return request({
    url: API_PREFIX+'/uploadAvatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Dispositon': 'inline', //设置应答方式为内联
      isToken: true
    }
  })
}
