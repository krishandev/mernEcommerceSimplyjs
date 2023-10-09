const bcrypt=require('bcryptjs');

exports.hashpassword=async(password)=>{
    try {
        const round=10;
        const hashedpassword=await bcrypt.hash(password, round);
        return hashedpassword;
    } catch (error) {
        console.log(error);
        
    }
}

exports.comparePassword=async(password, hashingpassword)=>{
  return bcrypt.compare(password, hashingpassword);
}