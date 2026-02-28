const Expense=require("../models/Expense");
const monthlySummary=async (req,res)=>{
    try{
    const {year,month}=req.query;
    if(!year||!month){
        return res.status(400).json({message:"year and month required"});
    }
    const startDate=new Date(year,month-1,1);
    const endDate=new Date(year,month,1);
    const summary=await Expense.aggregate([
    {
        $match:{
            user:new (require("mongoose").Types.ObjectId)(req.user.userId),
            date:{$gte:startDate,$lt:endDate}
        }
    },
    {
        $group:{
            _id:"$type",
            total:{$sum:"$amount"}
        }
    }
    ]); 
    return res.json(summary);
    }catch(e){
        console.log(e.message);
        return res.status(500).json({message:"Server error"});
    }
};
const categoryBreakdown=async(req,res)=>{
    try{
        const {year,month}=req.query;
        if(!year||!month){
            return res.status(400).json({message:"year and month required"});
        }
        const startDate=new Date(year,month-1,1);
        const endDate=new Date(year,month,1);
        const data=await Expense.aggregate([
        {
            $match:{
                user:new(require("mongoose").Types.ObjectId)(req.user.userId),
                type:"expense",
                date:{$gte:startDate,$lt:endDate}
            }
        },
        {$group:{
            _id:"$category",
            total:{$sum:"$amount"}

        }}
        ]);
        return res.json(data);
    }catch(e){
        console.log(e.message);
        return res.json(500).json({message:"Server error"});
    }

}
const trend6Months=async(req,res)=>{
    try{
        const {year,month}=req.query;
        if(!year||!month){
            return res.status(400).json({message:"year and month required"});
        }
        const y=Number(year);
        const m=Number(month);
        const start=new Date(y,m-6,1);
        const end=new Date(y,m,1);
        const rows=await Expense.aggregate([
            {
                $match:{
                    user:new (require("mongoose").Types.ObjectId)(req.user.userId),
                    date:{$gte:start,$lt:end},

                },
            },
            {
                $group:{
                   _id:{
                        y:{$year:"$date"},
                        m:{$month:"$date"},
                        type:"$type"
                   },
                   total:{$sum:"$amount"},
                }
            }
        ]

        );
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const result=[];
        for(let i=5;i>=0;i--){
            const d=new Date(y,m-1-i,1);
            const yy=d.getFullYear();
            const mm=d.getMonth()+1;
            const label=`${monthNames[mm-1]} ${yy}`;
            const incomeRow=rows.find(r=>r._id.y===yy && r._id.m === mm && r._id.type==="income");
            const expenseRow=rows.find(r=>r._id.y===yy && r._id.m === mm && r._id.type==="expense");
            result.push({
                year:yy,
                month:mm,
                label,
                income:incomeRow?.total||0,
                expense:expenseRow?.total||0,

            })
        }
        return res.json(result);

    }catch(e){
        console.log(e.message);
        return res.status(500).json({message:"Server error"});
    }

}
module.exports={monthlySummary,categoryBreakdown,trend6Months};