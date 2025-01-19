import { Schema,model } from "mongoose";


const additionalDetailsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationName: { type: String, required: true },
    panCardNumber: { type: String, required: true },
    organizationAddress: { type: String, required: true },
    contactDetails:{
        name:{ type: String, required: true },
        email:{ type: String, required: true },
        phone:{ type: String, required: true },  
    },
    bankDetails:{
        beneficiaryName: { type: String, required: true },
        accountType: { type: String, required: true },
        accountNumber: { type: String, required: true },
        bankName: { type: String, required: true },
        ifscCode: { type: String, required: true },
    },
    panCard: { type: String, required: true }, 
    
})

const AdditionalDetails = model("AdditionalDetails", additionalDetailsSchema);

export default AdditionalDetails;