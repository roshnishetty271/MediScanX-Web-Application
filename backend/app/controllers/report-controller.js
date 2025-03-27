import * as reportservice from '../services/report-service.js'
import {setResponse, setErrorResponse} from './response-handler.js';

export const find =  async (request , response) =>{
    try{
        const params ={...request.query};
        const reports = await reportservice.search(params);
        setResponse(reports,response);

    } catch(err){
       
            setErrorResponse(err, response);
    }
}

export const post =  async (request , response) =>{
    try{
        const newReport = {...request.body}
        const report =  await reportservice.save(newReport);
        response.status(200)
        .json(report);

    }catch(err){
        console.log(err)
        response.status(500)
            .json({
                    code :"Service Error"

            })



    }
    

}