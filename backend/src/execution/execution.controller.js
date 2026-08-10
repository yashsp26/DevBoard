import { executeCode } from './execution.service.js';

export async function runCode(req, res, next) {
  try {
    const result = await executeCode(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}