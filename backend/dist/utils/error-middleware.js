export const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    const statusCode = res.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const cause = err.cause || message;
    return res.status(statusCode).json({ message, cause });
};
//# sourceMappingURL=error-middleware.js.map