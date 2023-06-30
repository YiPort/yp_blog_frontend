import request from '@/utils/request'

// 分页查询文章列表
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

// 查询最热文章
export function hotArticleList() {
  return request({
    url: '/article/hotArticleList',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

// 获取文章详情
export function getArticle(articleId) {
  return request({
    url: '/article/' + articleId,
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

// 更新文章浏览次数
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
export function postArticle(articleId,userId,title,content,summary,status,isComment,id,thumbnail) {
  return request({
    url: '/article/postArticle',
    method: 'post',
    headers: {
      isToken: true
    },
    data: {
      'id':articleId,
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

// 获取草稿
export function getDraft(createBy) {
  return request({
    url: '/article/getDraft/' + createBy,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 获取编辑记录
export function getEditHistory(createBy) {
  return request({
    url: '/article/getEditHistory/' + createBy,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 删除草稿
export function deleteDraft(createBy,articleId) {
  return request({
    url: '/article/deleteDraft/' + createBy + '/' + articleId,
    headers: {
      isToken: true
    },
    method: 'delete'
  })
}

// 添加收藏
export function addCollection(createBy,articleId) {
  return request({
    url: '/collection/addCollection/' + createBy + '/' + articleId,
    headers: {
      isToken: true
    },
    method: 'put'
  })

}


// 获取收藏文章列表
export function getCollectList(createBy) {
  return request({
    url: '/collection/getCollectList/' + createBy,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}
