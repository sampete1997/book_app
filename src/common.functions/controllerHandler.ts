import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const route = express.Router();

class ControllerHandler {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  callabck: (req: Request, res: Response) => Promise<any>;
  validator: any;

  constructor(
    url: string,
    method: "get" | "post" | "put" | "delete" | "patch",
    validator: any,
    callabck: (req: Request, res: Response) => Promise<any>
  ) {
    (this.url = url),
      (this.method = method),
      (this.callabck = callabck),
      (this.validator = validator);
  }
  exe = () => {
    route[this.method](
      this.url,
      this.validator,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.json({
              status: 400,
              message: "error",
              response: errors.array().map((error) => error.msg),
            });
          }else{

          const result: {
            status: number;
            response: any;
          } = await this.callabck(req, res);

          res.json({
            status: result?.status || 200,
            message: "success",
            response: result.response,
          });
        }

        } catch (err: any) {
          res.json({
            status: err?.status || 500,
            message: "error",
            response: err?.response || ["something went wrong"],
          });
 
          throw new Error(err);
        }

      }
    );
  };

  getRoute() {
    return route;
  }
}

export default ControllerHandler;
