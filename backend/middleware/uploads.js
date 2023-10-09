const multer=require('multer');

const storage=multer.diskStorage({
    destination:(req, file, cb)=>{
    cb(null, "./uploads")},

    filename:(req, file, cb)=>{
        cb(null, `image-${Date.now()}.${file.originalname}`)}

})

const filefilter=(req, file, cb)=>{
    if(file.mimetype==="image/png" || file.mimetype==="image/jpeg" || file.mimetype==="image/jpg" || file.mimetype==="image/webp"){
        cb(null, true)
    }
    else{
        cb(null, false)
        cb(new Error("Only Images Allowed"));
    }
    
}

const upload=multer({
    storage:storage,
    fileFilter:filefilter
})

module.exports=upload;