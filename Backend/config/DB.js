import mongoose from "mongoose";

const ConfigDb = async()=>{
    try{
        await mongoose.connect(process.env.DB)
        console.log('connected to db')
    }catch(err){
        console.log(err)
    }
}


export default ConfigDb