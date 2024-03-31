import request from '@/utils/requestBlog'

const API_PREFIX = '/search'


// 提交文章目录索引
export function postArticleIndex(directoryIndex) {
  return request({
      url: API_PREFIX + '/index/postArticleIndex',
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
// 搜索文章内容
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

// 删除文章目录索引
export function deleteArticleIndex(indexId) {
  return request({
    url: API_PREFIX + '/index/deleteArticleIndex/'+indexId,
    method: 'delete',
    headers: {
      isToken: true
    }
  })
}

