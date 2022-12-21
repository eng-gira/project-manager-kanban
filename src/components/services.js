export function useServices() {
    const apiServices = (functionName, paramsArr = [], payloadKeyValPairs = null, consoleLogRespData = false) => {
        let parameters = []

        if(paramsArr.length > 0) parameters.push(...paramsArr)
        if(payloadKeyValPairs !== null) parameters.push(JSON.stringify(payloadKeyValPairs))

        return functionName(...parameters).then((resp) => {
            if(resp.data.message != 'failed') {
                if(consoleLogRespData) console.log(resp.data.data)
                return { message: 'success', 'data': resp.data.data }
            } else {
                if(consoleLogRespData) console.log('failed:', resp.data.data)
                return { message: 'failed', 'data': resp.data.data }
            }
        }).catch((err) => {
            if(consoleLogRespData) console.log('failed:', err)
            return { message: 'failed', 'data': err }
        })
    }

    return { apiServices }
}