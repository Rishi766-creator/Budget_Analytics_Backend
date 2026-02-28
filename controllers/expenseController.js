const Expense=require("../models/Expense");
const createExpense=async(req,res)=>{
    try{
        const {amount,category,date,note,paymentMethod,type}=req.body;
        if(amount==undefined||!category||!date){
            return res.status(400).json({message:"amount,category,date are required"});
        }
        const expense=await Expense.create({
            user:req.user.userId,
            type:type||"expense",
            amount,
            category,
            date,
            note:note||"",
            paymentMethod:paymentMethod||"upi"


        });
        return res.status(201).json({message:"Created",expense});

    }catch(e){
        console.error("CREATE EXPENSE ERROR",e);
        return res.status(500).json({message:"Server error"});

    }
};
const listExpense=async(req,res)=>{
    try{
        const {category,from,to,type}=req.query;
        const filter={user:req.user.userId};
        if(type) filter.type=type;
        if(category) filter.category=category;
        if(from||to){
            filter.date={};
            if(from) filter.date.$gte=new Date(from);
            if (to) {
  const end = new Date(to);
  end.setHours(23, 59, 59, 999);
  filter.date.$lte = end;
}
        }
        const expenses=await Expense.find(filter).sort({date:-1});
        return res.status(200).json({count:expenses.length,expenses});

    }catch(e){
        console.error("LIST EXPENSES ERROR:",e);
        return res.status(500).json({message:"Server error"});
    }

}
const updateExpense = async (req, res) => {
  try {
    const allowed = ["type", "amount", "category", "date", "note", "paymentMethod"];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Updated", expense });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
const deleteExpense=async (req,res)=>{
    try{
        const expense=await Expense.findOneAndDelete(
            {_id:req.params.id,
                user:req.user.userId
            }
        );
        if(!expense){
            return res.status(404).json({message:"Expense not found"});
        }
        res.json({message:"Expense deleted successfully"});
    }catch(e){
    res.status(500).json({message:e.message})};

};
module.exports={createExpense,listExpense,updateExpense,deleteExpense};