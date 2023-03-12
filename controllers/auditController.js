const auditQueries = require('../databaseRequests/audit.queries.js');
const userQueries = require('../databaseRequests/user.queries');
const createAuditData = async (req, res) => {
  try {
    const userId = parseInt(req.body.username);
    const foundUser = await userQueries.findUserById(userId);
    let usernameValue = req.body.username;
    if(foundUser)
    {
      usernameValue = foundUser.username;
    }

    const data = {
      actionRefId: req.body.actionRefId,
      action: req.body.action,
      username: usernameValue
    };
    const audit = await auditQueries.createAuditData(data);
    if(audit)
    {
      res.status(200).json({
        message: 'audit entry data posted'
      });
    }
    else{
      res.status(500).json({
        message: 'server error'
      });
    }
  } catch {
    res.status(500).json({
      message: 'server error'
    });
  }
};

//Get audit data but check if the user is an admin
const getAuditData = async (req, res) => {
  try {
    const requestersId = parseInt(req.params.id);
    const user = await userQueries.findUserById(requestersId,['userid', 'adminFlag']);
    if(user) {
      //have user check flag
      if(user.adminFlag === 0){
        //not authorised
        res.status(401).json({
          message: 'bad request cant check admin status'
        })
      }
      else {
        //success
        //Possible where conditions
        let where = {};
        const whereData = req.params.data;
        switch(whereData) {
          default:
          where = {};
        }
        //All
        //
        const auditData = await auditQueries.getAuditData(where
          ,['username','ref','entry', 'createdAt' ]);
        const response = {auditList: auditData}
        res.status(200).json(response);
      }
    }
    else{
      res.status(404).json({
        message: 'bad request cant check admin status'
      })
    }


  } catch {
    res.status(500).json({
      message: 'internal server error'
    });
  }
};

module.exports = { createAuditData, getAuditData};
