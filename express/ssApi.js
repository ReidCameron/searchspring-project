const axios = require('axios').default;
//TODO: Put site id in netlify enviornment variables
const siteId = 'scmq7n'; //unique id to access api

//Returns result from search spring API
function callSearch(queries, ssSessionIdNamespace, ssUserId, ssPageLoad){

    //Create URL
    let url = new URL(`https://${siteId}.a.searchspring.io/api/search/search.json`)
    url.searchParams.append('siteId',siteId)
    url.searchParams.append('resultsFormat','native')
    Object.keys(queries).forEach( (v) =>{
        url.searchParams.append(v,queries[v])
    })
    
    //Set Options
    let options = {
        method: 'GET',
        url: url,
        headers: {
            accept: 'application/json',
            'searchspring-session-id': ssSessionIdNamespace,
            'searchspring-user-id': ssUserId,
            'searchspring-page-load-id': ssPageLoad
        }
    }

    //Call API and Return Request
    return axios.request(options);   
}

module.exports = { callSearch };
