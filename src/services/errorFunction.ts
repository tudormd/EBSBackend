import { Response } from 'express';

export const throwError = (code:number, errorType:string, errorMessage:string) =>  (error:{code?:number, errorType?:string, message?:string}) => {
    if (!error) error = new Error(errorMessage || 'Default Error')
    error.code = code
    error.errorType = errorType        
    throw error 
}

export const sendSuccess = (res:Response, message:string) => (data:Object) => {
    res.status(200).json({ type: 'success', message, data })
}

export const sendError = (res?:Response, status?:number, message?:string) => (error:{code:number, message:string}) => {
    res.status(status || error.code || 409).json({
         type: 'error',
        message: message || error.message,
       error
    })
}