import request from '../utils/request';

const API_PREFIX = '/blog'


//获取ip所在地数据列表
export function getIpAdress(){
    return request({
        url: API_PREFIX+'/system/ip',
        methods: 'get',
        headers: {
            isToken: true
        }
    })
}

//
export function getCache(){
    return request({
        url: API_PREFIX+'/system/cache',
        methods: 'get',
        headers: {
            isToken: true
        }
    })
}
