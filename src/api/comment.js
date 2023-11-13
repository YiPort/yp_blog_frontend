import request from '@/utils/request'

const API_PREFIX = '/blog'

// 发送文章评论
export function sendComment(type,articleId,rootId,toCommentId,toCommentUserId,createBy,content,createNick,avatar) {
  return request({
    url: API_PREFIX + '/comment/',
    method: 'post',
    headers: {
      isToken: true
    },
    data: {
      "articleId":articleId,
      "type":type,
      "rootId":rootId,
      "toCommentId":toCommentId,
      "toCommentUserId":toCommentUserId,
      "createBy":createBy,
      "content":content,
      "createNick":createNick,
      "avatar":avatar
    }
  })
}

// 获取当前文章评论列表
export function getArticleComment(query) {
    return request({
        url: API_PREFIX + '/comment/commentList',
        method: 'get',
        headers: {
          isToken: false
        },
        params: query
    })
}

// 获取友链评论列表
export function getLinkComment(query) {
    return request({
        url: API_PREFIX + '/comment/linkCommentList',
        method: 'get',
        params: query
    })
}

// 置顶/取消置顶评论
export function setTop(id,label) {
  return request({
    url: API_PREFIX+'/comment/setCommentTop/' + id + '/' + label,
    method: 'put',
    headers: {
      isToken: true
    }
  })
}
