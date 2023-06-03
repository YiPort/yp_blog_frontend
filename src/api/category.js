import request from '@/utils/request'

// 查询分类列表
export function getCategoryList() {
    return request({
        url: '/category/getCategoryList',
        headers: {
          isToken: false
        },
        method: 'get'
    })
}

// 新建分类
export function addCategory(categoryName,description,createBy) {
    return request({
        url: '/category/addCategory',
        headers: {
            isToken: true
        },
        method: 'post',
       data: {'name':categoryName,'description':description,'createBy':createBy}
    })
}
