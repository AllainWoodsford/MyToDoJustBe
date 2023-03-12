const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.js');
const { createAuditData, getAuditData } = require('../controllers/auditController.js');

//Get Routes
//The param is the userId need to check if admin otherwise res will be unAuth
router.get('/audit/:id', verifyToken, getAuditData);

//Post Routes
router.post('/audit', verifyToken, createAuditData);

module.exports = router;
