export const throwError = (code, errorType, errorMessage) => error => {
    if (!error) error = new Error(errorMessage || 'Default Error')
    error.code = code
    error.errorType = errorType        
    throw error
}

export const sendSuccess = (res, message) => data => {
    res.status(200).json({ type: 'success', message, data })
}

export const sendError = (res, status?, message?) => error => {
    res.status(status || error.code).json({
        type: 'error',
        message: message || error.message,
        error
    })
}