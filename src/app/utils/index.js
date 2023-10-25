import AxiosObj from "../axios/AxiosObj"

export const getApiData = async (url) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'session/session-list/',
        headers: {}
    };
    try {
        const res = await AxiosObj.get('session/session-list/')
        return res.data;
    } catch (e) {
        console.log('failed to fetch data from ', url);
    }
}

const doArchieve = async (id, endpoint) => {
    let data = JSON.stringify({
        "is_active": false
    });

    let config = {
        method: 'PETCH',
        maxBodyLength: Infinity,
        url: endpoint + '/' + id + '/',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    AxiosObj.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

export const handleArchieve = (id, endpoint) => {
    doArchieve(id, endpoint)
}

const doUnarchieve = async (id, endpoint) => {
    let data = JSON.stringify({
        "is_active": true
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: endpoint + '/' + id + '/',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    AxiosObj.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

export const handleUnarchieve = (id, endpoint) => {
    doUnarchieve(id, endpoint)
}

const doDelete = async (id, endpoint) => {
    let data = ''

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: endpoint + '/' + id + '/',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    AxiosObj.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

export const handleDelete = (id, endpoint) => {
    doDelete(id, endpoint)
}

