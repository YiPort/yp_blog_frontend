import request from '@/utils/request'

const API_PREFIX = '/blog'

// 查询所有审核通过的友链列表
export function getAllLink(query) {
    return request({
        url: API_PREFIX + '/link/getAllLink',
        method: 'get',
        headers: {
          isToken: false
        },
        params: query
    })
}

