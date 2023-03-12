const { connect } = require('../dbSequelize.js');

class AuditQueries {
  constructor() {
    this.db = connect();
  //  For Development if { force: true } drops table if it exists incase fields need to change

    // this.db.sequelize.sync({ force: true } ).then(() => {
    //     console.log("Drop and re-sync db.");
    // });
  }

  async createAuditData(data){
    try {
      console.log('attempt create item');
      console.log(data);
      const auditEntry = await this.db.sequelize.models.audits.create({
        entry: data.action,
        ref: data.actionRefId,
        username: data.username,
    });
    return auditEntry;
    } catch {
      console.log('failed');
      return null;
    }
  }

  async getAuditData(where,attributes) {
    try{
      //add a check for if they are admin or not
      const allAudits = await this.db.sequelize.models.audits.findAll({
       attributes: attributes}
      );
       console.log(allAudits);
      return allAudits

    }
    catch {
      return [];
    }
  }
}

module.exports = new AuditQueries();
