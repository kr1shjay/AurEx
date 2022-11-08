import axios from 'axios'





export const GetData = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/get-contact`,
            'method': 'get'
        })
        return {
            status: "success",
            loading: false,
            result: respData.data.result.data
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
           
        }
    }
}


export const AdminMsg = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/admin-rly`,
            'method': 'put',
            data
        })
        return {
            status: respData.data.status,
            loading: false,
            // result: respData.data.result.data,
            message:respData.data.message
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            errors:err.response.data.errors
        }
    }
}


// export const DeleteData = async () => {
//     try {
//         const respData = await axios({
//             'url': `/adminapi/contact-delete`,
//             'method': 'get'
//         })
//         return {
//             status: "success",
//             loading: false,
//             result: respData.data.result
//         }
//     } catch (err) {
//         return {
//             status: 'failed',
//             loading: false
//         }
//     }
// }