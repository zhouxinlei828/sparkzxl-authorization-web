import request from '@/utils/request'

const api = {
  dictionaryItem: '/uaa/common/dictionaryItem/dictionaryItemList',
  dictionaryPage: '/uaa/common/dictionary/page',
  dictionaryItemPage: '/uaa/common/dictionaryItem/page',
  saveDictionary: '/uaa/common/dictionary/save',
  updateDictionary: '/uaa/common/dictionary/update',
  deleteDictionary: '/uaa/common/dictionary/delete',
  saveDictionaryItem: '/uaa/common/dictionaryItem/save',
  updateDictionaryItem: '/uaa/common/dictionaryItem/update',
  deleteDictionaryItem: '/uaa/common/dictionaryItem/delete',
}

export function getDictionaryItemList(parameter) {
  return request({
    url: api.dictionaryItem,
    method: 'get',
    params: parameter,
  })
}

export function getDictionaryPage(parameter) {
  return request({
    url: api.dictionaryPage,
    method: 'post',
    data: parameter,
  })
}

export function getDictionaryItemPage(parameter) {
  return request({
    url: api.dictionaryItemPage,
    method: 'post',
    data: parameter,
  })
}

export function saveDictionary(parameter) {
  return request({
    url: api.saveDictionary,
    method: 'post',
    data: parameter,
  })
}

export function updateDictionary(parameter) {
  return request({
    url: api.updateDictionary,
    method: 'put',
    data: parameter,
  })
}

export function deleteDictionary(parameter) {
  return request({
    url: api.deleteDictionary.concat('?ids[]=').concat(parameter),
    method: 'delete',
  })
}

export function saveDictionaryItem(parameter) {
  return request({
    url: api.saveDictionaryItem,
    method: 'post',
    data: parameter,
  })
}

export function updateDictionaryItem(parameter) {
  return request({
    url: api.updateDictionaryItem,
    method: 'put',
    data: parameter,
  })
}

export function deleteDictionaryItem(parameter) {
  return request({
    url: api.deleteDictionaryItem.concat('?ids[]=').concat(parameter),
    method: 'delete',
  })
}
