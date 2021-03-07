import axios from 'axios';
import decompressResponse from 'decompress-response';

export const getQuestions = async(tag, startDate, endDate, sortBy) => {
    try {
        //--------------------------------------------
        //Send Get request to Stack Overflow using axios, then decompress response
        //then if no errors or backoff status code, return data
        //--------------------------------------------
        const resp = await axios.get(`${process.env.REACT_APP_API_ROUTE}/questions?fromdate=${startDate}&todate=${endDate}&order=desc&sort=${sortBy}&tagged=${tag}&site=stackoverflow&filter=${process.env.REACT_APP_QUESTION_FILTER}&key=${process.env.REACT_APP_KEY}`)
        const decResp = decompressResponse(resp)
        const statusCode = decResp.status
        const data = decResp.data
        var questions = {}
        switch(statusCode) {
            //OK
            case 200:
                questions = data.items
                break
            //Temporarily Unavailable
            case 503:
                alert("Stack Overflow is temporarily unavailable")
                break
            default: 
                console.log(statusCode)
                break
        }
        return questions
    } catch(error) {
        alert("Problem with tag, refresh and try again")
        return false
    }
}

export const getAnswers = async(id) => {
    try {
        //--------------------------------------------
        //Send Get request to Stack Overflow using axios, then decompress response
        //then if no errors or backoff status code, return data
        //--------------------------------------------
        const resp = await axios.get(`${process.env.REACT_APP_API_ROUTE}/questions/${id}/answers?order=desc&sort=votes&site=stackoverflow&filter=${process.env.REACT_APP_ANSWER_FILTER}&key=${process.env.REACT_APP_KEY}`)
        const decResp = decompressResponse(resp)
        const statusCode = decResp.status
        const data = decResp.data
        var questionAnswers = {}
        switch(statusCode) {
            //OK
            case 200:
                questionAnswers = data.items
                break
            //Temporarily Unavailable
            case 503:
                alert("Stack Overflow is temporarily unavailable")
                break
            default:
                console.log(statusCode)
                break
        }
        return questionAnswers
    } catch(error) {
        alert("Problem loading answers, refresh and try again")
        return false
    }
}