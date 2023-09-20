﻿import request from '@/utils/request'

// 发送文章评论
export function sendComment(type,articleId,rootId,toCommentId,toCommentUserId,createBy,content) {
  return request({
    url: '/comment/',
    method: 'post',
    headers: {
      isToken: true
    },
    data: {"articleId":articleId,"type":type,"rootId":rootId,"toCommentId":toCommentId,"toCommentUserId":toCommentUserId,"createBy":createBy,"content":content}
  })
}

// 获取当前文章评论列表
export function getArticleComment(query) {
    return request({
        url: '/comment/commentList',
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
        url: '/comment/linkCommentList',
        method: 'get',
        params: query
    })
}
