const fetch = require('node-fetch');

exports.sfetch = async (url, payload) => {
    const fetchRes = await fetch(url, payload);
    const result = await fetchRes.json()

    if (!result) {
        const error = (result && result.message) || fetchRes.status;
        return Promise.reject(error)
    } else {
        return result;
    }
}