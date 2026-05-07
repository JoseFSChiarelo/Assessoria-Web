import { ApiError } from "../utils/api-error.js";

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      throw new ApiError(400, firstIssue?.message ?? "Invalid request");
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    next();
  };
}
