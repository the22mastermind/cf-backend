const successResponse = (res, statusCode, message, token, data) => res.status(statusCode).json({
  message,
  token,
  data,
});

const errorResponse = (res, statusCode, error) => res.status(statusCode).json({ error });

export default {
  successResponse,
  errorResponse,
};
