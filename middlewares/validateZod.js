export const validate = (shema) => (req,res,next) =>{
 const result = shema.safeParse(req.body);
 
 
 if(!result.success){
    const formatResult =result.error.format();
    console.log(formatResult);
    
    return res.status(400).json({
        success: false,
        message : "validate failed",
        errors : Object.keys(formatResult).map(field =>({
            field,
            message : formatResult[field]?._errors?.[0] || 'invalid input'
        }))
    })
 }
 next()
}




