const dbModel = require('../models/billsModel');

module.exports.getAllRenters =  function(req, res) {  

    let sql = "SELECT * FROM BILLS";
    dbModel.customQuery(sql,function (err, result){ 
        console.log(sql);

        if (err) throw err;                    
        res.json(result);

    });
}