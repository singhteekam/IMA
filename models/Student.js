const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:{
        type:String,
        required:false
    },
    
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    profilephoto:{
        type: String,
        default:""
    },
    physicsST1:{
        type: String,
        default:""
    },
    chemistryST1:{
        type: String,
        default:""
    },
    mathsST1:{
        type: String,
        default:""
    },
    physicsST2:{
        type: String,
        default:""
    },
    chemistryST2:{
        type: String,
        default:""
    },
    mathsST2:{
        type: String,
        default:""
    },
    physicsPUE:{
        type: String,
        default:""
    },
    chemistryPUE:{
        type: String,
        default:""
    },
    mathsPUE:{
        type: String,
        default:""
    },
    physicsST1TM:{
        type: String,
        default:""
    },
    chemistryST1TM:{
        type: String,
        default:""
    },
    mathsST1TM:{
        type: String,
        default:""
    },
    physicsST2TM:{
        type: String,
        default:""
    },
    chemistryST2TM:{
        type: String,
        default:""
    },
    mathsST2TM:{
        type: String,
        default:""
    },
    physicsPUETM:{
        type: String,
        default:""
    },
    chemistryPUETM:{
        type: String,
        default:""
    },
    mathsPUETM:{
        type: String,
        default:""
    },
});

module.exports=Student=mongoose.model('students',UserSchema);