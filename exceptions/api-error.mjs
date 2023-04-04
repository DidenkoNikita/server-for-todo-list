class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
      super(message);
      this.status = status;
      this.errors = errors;
  }

    UnauthorizedError() {
      return new ApiError(401, 'Пользователь не авторизован')
  }

    BadRequest(message, errors = []) {
      return new ApiError(400, message, errors);
  }
}

export default new ApiError()