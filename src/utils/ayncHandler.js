
//APPROACH 1--> USONG PROMISES

// asyncHandler is a higher-order function that wraps any async route handler
const asyncHandler = (requestHandler) => {
    // Returns a new function that Express will use as middleware
    return  (req, res, next) => {
        // If the async function throws an error, Promise.reject will catch it
        Promise.resolve(requestHandler(req, res, next))
               .catch((err) => next(err)); // Pass error to Express error handler
    };
};

export { asyncHandler };






//Approach --> 2  using try and catch

// step1 const asyncHandler =()=>{}
// step2 const asyncHandler =(func)=>()=>{}
// step3 const asyncHandler =(func)=>async ()=>{}

    // const asyncHandler =(fn)=> async (req,res,next)=>{
    //     try {
    //         await fn(req,res,next)
    //     } catch (error) {
    //         res.status(error.code || 500).json({
    //             success:false,
    //             message:err.message
    //         })
    //     }
    // }