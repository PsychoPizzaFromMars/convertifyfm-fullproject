const CONVERTIFY_API_BASE_URL = process.env.REACT_APP_CONVERTIFY_API_BASE_URL || 'http://localhost:8000';

const makeRequest = async function ({
    endpoint,
    body = null,
    method = 'GET',
    headers = {},
    other = {},
}) {
    const bodyString = JSON.stringify(body)
    const url = CONVERTIFY_API_BASE_URL + endpoint
    let json

    const response = await fetch(url, {
        method,
        ...(body && {body: bodyString}),
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        ...other
    })
    if (!response.ok) {
        let message = `Failed api request to ${url}`
        try {
            const responseText = await response.text()
            if (responseText) {
                message += responseText
            }
        } catch (e) {
            throw new Error(`Api request to ${url}: ${message} ${response.status}`)
        }
    }
    try {
        // incase the the server returns invalid json
        json = await response.json()
    } catch (e) {
        return ''
    }
    return json
}

export { makeRequest }