import ApiError from "../utils/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
    new ApiError(
            400,
            "Validation failed",
            result.error.issues
        )
      );
    }

    req.validatedData = result.data.body;

    next();
  };
};

export default validate;