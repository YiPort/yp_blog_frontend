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
export function getDraft() {
  return request({
    url: API_PREFIX + '/article/getDraft',
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 获取编辑记录
export function getEditHistory() {
  return request({
    url: API_PREFIX + '/article/getEditHistory' ,
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 删除草稿
export function deleteDraft(articleId) {
  return request({
    url: API_PREFIX + '/article/deleteDraft/'  + articleId,
    headers: {
      isToken: true
    },
    method: 'delete'
  })
}

// 添加收藏
export function addCollection(articleId) {
  return request({
    url: API_PREFIX + '/collection/addCollection/' + articleId,
    headers: {
      isToken: true
    },
    method: 'put'
  })

}


// 获取收藏文章列表
export function getCollectList() {
  return request({
    url: API_PREFIX + '/collection/getCollectList',
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 取消收藏文章
export function deleteCollection(articleId) {
  return request({
      url: API_PREFIX + '/collection/deleteCollection/' +articleId,
      headers: {
        isToken: true
      },
      method: 'delete'
  })
}


// 提交文章问题
export function postQuestion(articleId,description) {
  return request({
    url: API_PREFIX + '/question/postQuestion',
    method: 'post',
    headers: {
      isToken: true
    },
    data: {
      'articleId':articleId,
      'questionDescription':description
    }
  })
}

// 获取反馈列表
export function getQuestionList() {
  return request({
    url: API_PREFIX + '/question/getQuestionList',
    method: 'get',
    headers: {
      isToken: true
    }
  })
}

// 删除文章问题
export function deleteQuestion(id) {
  return request({
    url: API_PREFIX + '/question/deleteQuestion/' + id,
    method: 'delete',
    headers: {
      isToken: true
    }
  })
}

// 获取我发布的文章总数
export function getMyArticleTotal() {
  return request({
    url: API_PREFIX + '/article/getMyArticleTotal',
    method: 'get',
    headers: {
      isToken: true
    }
  })
}

// 获取我发布的文章总浏览量
export function getTotalView() {
  return request({
    url: API_PREFIX +'/article/getTotalView' ,
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
