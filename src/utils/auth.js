let redis = "FullprocessManagePlatformToken"

/**
 * 设置
 * @param k 键key
 * @param v 值value 
 */
function setToken(value) {
    uni.setStorageSync(redis, {
        date: parseInt((Date.parse(new Date()) / 1000) * 1.02),
        value
    })
}

/**
 * 获取
 * @param k 键key
 * @returns {null|any}
 */
function getToken() {
    const token = uni.getStorageSync(redis)
    if (token.date) {
        if (parseInt(token.date < Date.parse(new Date()) / 1000)) {
            removeToken()
            return null
        } else {
            return token.value
        }
    } else {
        return null
    }
}

/**
 * 删除
 * @param k
 */
function removeToken(k) {
    uni.removeStorageSync(redis);
}

/**
 * 清除所有key
 */
function clearToken() {
    uni.clearStorageSync();
}

export {
    setToken,
    getToken,
    removeToken,
    clearToken
}