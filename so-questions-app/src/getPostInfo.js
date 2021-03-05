import axios from 'axios';

export const getQuestions = async(tag, startDate, endDate, sortBy) => {
    try {
        const resp = await axios.get(`https://api.stackexchange.com/2.2/questions?fromdate=${startDate}&todate=${endDate}&order=desc&sort=${sortBy}&tagged=${tag}&site=stackoverflow&key=t29gugj)zVXNQJ5n)lgk0Q((`)
        const statusCode = resp.status
        const data = resp.data
        var questions = {}
        switch(statusCode) {
            case 200: //OK
                console.log("OK")
                questions = data.items
                break
            case 400: //Bad Parameter
                console.log("Bad Parameter")
                break
            case 404: //No Method
                console.log("No Method")
                break
            case 409: //Duplicate Request
                console.log("Duplicate Request")
                break
            case 500: //Internal Error
                console.log("Internal Error")
                break
            case 502: //Throttle Violation
                console.log("Throttle Violation")
                break
            case 503: //Temporarily Unavailable
                console.log("Temporarily Unavailable")
                //backoff
                break
            default:
                break
        }
        return questions
    } catch(error) {
            return false
    }
}

export const getQuestionAnswers = async(id) => {
    try {
        const resp = await axios.get(``)
        const statusCode = resp.status
        const data = resp.data
        var questionAnswers = {}
        switch(statusCode) {
            case 200: //OK
                console.log("OK")
                questionAnswers = data.items
                break
            case 400: //Bad Parameter
                console.log("Bad Parameter")
                break
            case 404: //No Method
                console.log("No Method")
                break
            case 409: //Duplicate Request
                console.log("Duplicate Request")
                break
            case 500: //Internal Error
                console.log("Internal Error")
                break
            case 502: //Throttle Violation
                console.log("Throttle Violation")
                break
            case 503: //Temporarily Unavailable
                console.log("Temporarily Unavailable")
                //backoff
                break
            default:
                break
        }
        return questionAnswers
    } catch(error) {
            return false
    }
}

export const getQuestionComments = async(id) => {
    try {
        const resp = await axios.get(``)
        const statusCode = resp.status
        const data = resp.data
        var questionComments = {}
        switch(statusCode) {
            case 200: //OK
                console.log("OK")
                questionComments = data.items
                break
            case 400: //Bad Parameter
                console.log("Bad Parameter")
                break
            case 404: //No Method
                console.log("No Method")
                break
            case 409: //Duplicate Request
                console.log("Duplicate Request")
                break
            case 500: //Internal Error
                console.log("Internal Error")
                break
            case 502: //Throttle Violation
                console.log("Throttle Violation")
                break
            case 503: //Temporarily Unavailable
                console.log("Temporarily Unavailable")
                //backoff
                break
            default:
                break
        }
        return questionComments
    } catch(error) {
            return false
    }
}

export const getAnswerComments = async(id) => {
    try {
        const resp = await axios.get(``)
        const statusCode = resp.status
        const data = resp.data
        var answerComments = {}
        switch(statusCode) {
            case 200: //OK
                console.log("OK")
                answerComments = data.items
                break
            case 400: //Bad Parameter
                console.log("Bad Parameter")
                break
            case 404: //No Method
                console.log("No Method")
                break
            case 409: //Duplicate Request
                console.log("Duplicate Request")
                break
            case 500: //Internal Error
                console.log("Internal Error")
                break
            case 502: //Throttle Violation
                console.log("Throttle Violation")
                break
            case 503: //Temporarily Unavailable
                console.log("Temporarily Unavailable")
                //backoff
                break
            default:
                break
        }
        return answerComments
    } catch(error) {
            return false
    }
}