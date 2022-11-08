import axios from 'axios'


export const ProfitManagementAction = async (data)=>{
    try{
        const respData = await axios({
            'url':'/adminapi/fetch-profit',
            'method':'get',
            'params':data
        })

        if (data.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'profitManagement.csv');
            document.body.appendChild(link);
            link.click();
        }

        if (data.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'profitManagement.xls');
            document.body.appendChild(link);
            link.click();
        }
        return {
            status:"success",
            loading:false,
            message:respData.data.message,
            result:respData.data.result
        }
    }
    catch(err){
          return{
              status:'failed',
              loading:false,
              message:err.response.data.message
          }
    }
}