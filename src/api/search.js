import request from '@/utils/request'

const API_PREFIX = '/search'


// 提交文章目录索引
export function postArticleIndex(directoryIndex,userId) {
  return request({
      url: API_PREFIX + '/index/postArticleIndex/' + userId,
      method: 'post',
      headers: {
          isToken: true
      },
      data: directoryIndex
  })
}

// 获取文章目录索引
export function getArticleIndex() {
  return request({
      url: API_PREFIX + '/index/getArticleIndex',
      method: 'get',
      headers: {
          isToken: false
      }
  })
}

export function searchArticle(query) {
  return request({
    url: API_PREFIX + '/searchArticle',
    method: 'get',
    headers: {
      isToken: false
    },
    params: query
  })
}

