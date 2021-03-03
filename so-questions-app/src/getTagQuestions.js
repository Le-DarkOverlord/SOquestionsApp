import React, { createContext, useState } from 'react';
//import axios from 'axios';

export const getTopVoted = async(tag) => {
    try {
        setIsLoading(true)
        const resp = await axios.get(`/2.2/questions/{ids}?order=desc&sort=votes&site=stackoverflow`)
        setIsLoading(false)
        const statusCode = resp.status
        const data = resp.data
        if (statusCode == 200) {
            setData(data)
            return true
        } catch(error) {
            setIsLoading(false)
            setHasError(true)
            setRespMessage('Error Getting Top Voted Questions')
            return false
        }
    }
}