import request from '@/utils/request'

// 查询文章列表
export function articleList(query) {
    return request({
        url: '/article/articleList',
        method: 'get',
        headers: {
          isToken: false
        },
        params: query
    })
}

//查询最热文章
export function hotArticleList() {
    return request({
        url: '/article/hotArticleList',
        headers: {
          isToken: false
        },
        method: 'get'
    })
}

//获取文章详情
export function getArticle(articleId) {
    return request({
        url: '/article/' + articleId,
        headers: {
          isToken: false
        },
        method: 'get'
    })
}

export function updateViewCount(articleId) {
    return request({
        url: '/article/updateViewCount/' + articleId,
        headers: {
          isToken: false
        },
        method: 'put'
    })

}



// 提交文章
export function postArticle(userId,title,content,summary,status,isComment,id,thumbnail) {
  return request({
    url: '/article/postArticle/',
    method: 'post',
    headers: {
      isToken: true
    },
    data: {
      'createBy':userId,
      'title':title,
      'content':content,
      'summary':summary,
      'status':status,
      'isComment':isComment,
      'categoryId':id,
      'thumbnail':thumbnail
    }
  })

}
