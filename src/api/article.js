import request from '@/utils/request'

const API_PREFIX = '/blog'

// 分页查询文章列表
export function articleList(query) {
  return request({
    url: API_PREFIX + '/article/articleList',
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
    url: API_PREFIX + '/article/hotArticleList',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

// 获取文章详情
export function getArticle(articleId) {
  return request({
    url: API_PREFIX + '/article/articleDetail/' + articleId,
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

// 更新文章浏览次数
export function updateViewCount(articleId) {
  return request({
    url: API_PREFIX + '/article/updateViewCount/' + articleId,
    headers: {
      isToken: false
    },
    method: 'put'
  })

}

// 提交文章
export function postArticle(articleId,userId,title,content,summary,status,isComment,id,thumbnail,viewCount) {
  return request({
    url: API_PREFIX + '/article/postArticle',
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
      'thumbnail':thumbnail,
      'viewCount':viewCount
    }
  })

}

// 获取草稿
export function getDraft(createBy) {
  return request({
    url: API_PREFIX + '/article/getDraft/' + createBy,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 获取编辑记录
export function getEditHistory(createBy) {
  return request({
    url: API_PREFIX + '/article/getEditHistory/' + createBy,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 删除草稿
export function deleteDraft(createBy,articleId) {
  return request({
    url: API_PREFIX + '/article/deleteDraft/' + createBy + '/' + articleId,
    headers: {
      isToken: true
    },
    method: 'delete'
  })
}

// 添加收藏
export function addCollection(createBy,articleId) {
  return request({
    url: API_PREFIX + '/collection/addCollection/' + createBy + '/' + articleId,
    headers: {
      isToken: true
    },
    method: 'put'
  })

}


// 获取收藏文章列表
export function getCollectList(createBy) {
  return request({
    url: API_PREFIX + '/collection/getCollectList/' + createBy,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 取消收藏文章
export function deleteCollection(createBy,articleId) {
  return request({
      url: API_PREFIX + '/collection/deleteCollection/' + createBy + '/' + articleId,
      headers: {
        isToken: true
      },
      method: 'delete'
  })
}


// 提交文章问题
export function postQuestion(articleId,userId,description) {
  return request({
    url: API_PREFIX + '/question/postQuestion',
    method: 'post',
    headers: {
      isToken: true
    },
    data: {
      'articleId':articleId,
      'createBy':userId,
      'questionDescription':description
    }
  })
}

// 获取反馈列表
export function getQuestionList(userId) {
  return request({
    url: API_PREFIX + '/question/getQuestionList/' + userId,
    method: 'get',
    headers: {
      isToken: true
    }
  })
}

// 删除文章问题
export function deleteQuestion(userId,id) {
  return request({
    url: API_PREFIX + '/question/deleteQuestion/' + userId + '/' + id,
    method: 'delete',
    headers: {
      isToken: true
    }
  })
}

// 获取我发布的文章总数
export function getMyArticleTotal(id) {
  return request({
    url: API_PREFIX + '/article/getMyArticleTotal/' + id,
    method: 'get',
    headers: {
      isToken: true
    }
  })
}

// 获取我发布的文章总浏览量
export function getTotalView(id) {
  return request({
    url: API_PREFIX +'/article/getTotalView/' + id,
    method: 'get',
    headers: {
      isToken: true
    }
  })
}

// 查询最新文章
export function latestArticleList() {
  return request({
    url: API_PREFIX +'/article/latestArticleList',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}
