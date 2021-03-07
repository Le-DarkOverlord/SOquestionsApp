import axios from 'axios';
import decompressResponse from 'decompress-response';

export const getQuestions = async(tag, startDate, endDate, sortBy) => {
    try {
        const resp = await axios.get(`${process.env.REACT_APP_API_ROUTE}/questions?fromdate=${startDate}&todate=${endDate}&order=desc&sort=${sortBy}&tagged=${tag}&site=stackoverflow&filter=${process.env.REACT_APP_QUESTION_FILTER}&key=${process.env.REACT_APP_KEY}`)
        const decResp = decompressResponse(resp)
        const statusCode = decResp.status
        const data = decResp.data
        var questions = {}
        switch(statusCode) {
            case 200: //OK
                console.log("OK");
                questions = data.items;
                break;
            //Bad Parameter
            case 400: console.log("Bad Parameter"); break;
            //No Method
            case 404: console.log("No Method"); break;
            //Duplicate Request
            case 409: console.log("Duplicate Request"); break;
            //Internal Error
            case 500: console.log("Internal Error"); break;
            //Throttle Violation
            case 502: console.log("Throttle Violation"); break;
            //Temporarily Unavailable
            case 503: console.log("Temporarily Unavailable");
                alert("Stack Overflow is temporarily Unavailable");
                break;
            default: console.log(decResp.statusCode); break;
        }
        return questions
    } catch(error) {
        return false
    }
}

export const getAnswers = async(id) => {
    try {
        const resp = await axios.get(`${process.env.REACT_APP_API_ROUTE}/questions/${id}/answers?order=desc&sort=votes&site=stackoverflow&filter=${process.env.REACT_APP_ANSWER_FILTER}&key=${process.env.REACT_APP_KEY}`)
        const decResp = decompressResponse(resp)
        const statusCode = decResp.status
        const data = decResp.data
        var questionAnswers = {}
        switch(statusCode) {
            case 200: //OK
                console.log("OK");
                questionAnswers = data.items;
                break;
            //Bad Parameter
            case 400: console.log("Bad Parameter"); break;
            //No Method
            case 404: console.log("No Method"); break;
            //Duplicate Request
            case 409: console.log("Duplicate Request"); break;
            //Internal Error
            case 500: console.log("Internal Error"); break;
            //Throttle Violation
            case 502: console.log("Throttle Violation"); break;
            //Temporarily Unavailable
            case 503: console.log("Temporarily Unavailable");
                alert("Stack Overflow is temporarily Unavailable");
                break;
            default: console.log(decResp.statusCode); break;
        }
        return questionAnswers
    } catch(error) {
        return false
    }
}