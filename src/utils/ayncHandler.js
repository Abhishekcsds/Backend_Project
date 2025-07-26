
//APPROACH 1--> USONG PROMISES

const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}


export {asyncHandler}




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