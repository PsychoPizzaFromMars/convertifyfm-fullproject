const makeRequest = async function ({
    endpoint,
    body = null,
    method = "GET",
    headers = {},
    other = { credentials: "include" },
}) {
    const CONVERTIFY_API_BASE_URL =
        process.env.REACT_APP_CONVERTIFY_API_BASE_URL ||
        "http://localhost:8000";
    const bodyString = JSON.stringify(body);
    const url = CONVERTIFY_API_BASE_URL + endpoint;
    let json;

    const response = await fetch(url, {
        method,
        ...(body && { body: bodyString }),
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...other,
    });
    if (!response.ok) {
        let errorResponse = await response.json();
        console.log(
            `Failed API request to ${url}: ${errorResponse.error.message} - ${errorResponse.error.details} (${response.status})`
        );
        throw new Error(
            `${errorResponse.error.message} (${errorResponse.error.details})`
        );
    }
    try {
        json = await response.json();
    } catch (e) {
        return "";
    }
    return json;
};

export { makeRequest };