// app/controllers/response-handles.js

export const setResponse = (data, res) => {
    res.status(200).json(data);
};

export const setErrorResponse = (error, res) => {
    res.status(500).json({
        code: "ServiceError",
        message: "Error occurred while processing your request."
    });
};