// tryCatchHandler.ts

import { Request, Response, NextFunction } from 'express';

// Method 1:-
// type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// const try_and_catch_handler = (asyncFn: AsyncHandlerFunction) => async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     await asyncFn(req, res, next);
//   } catch (error: any) {
//     console.error("An error occurred:", error);

//     // Customize the error response based on the status code
//     // const statusCode = error.statusCode || 500;
//     // const message = error.message || "Internal Server Error";

//     const statusCode = 500;
//     const message = "Internal Server Error";

//     return res.status(statusCode).json({
//       status: "failed",
//       message,
//     });
//   }
// };


//Method - 2
// const try_and_catch_handler = (request_handler: any) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         Promise.resolve(request_handler(req, res, next)).catch((error) => next(error));
//     };
// };

// Method -3
const try_and_catch_handler = (request_handler: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(request_handler(req, res, next)).catch((error) => {
            console.error('Error:', error); 
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        });
    };
};

export default try_and_catch_handler;

// const useError =(req: Request, res:Response)=>{

//     try{
//         const data={ key:"value"}
//         return [data, null]
//     }catch(error){
//         return [null, error]
//     }
// }

// const [ data, error] = useError(req, res)