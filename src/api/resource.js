import request from '@/utils/request'

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
