const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');
const path = require('path');

router
    .get('/' , (req , res) => {res.sendFile(path.join(__dirname, '../views', 'index.html'))})
    .post('/insert' , dbController.insertNewRecord)
    .get('/getAll' , dbController.getAllData)
    .patch('/update' , dbController.updateRecord)
    .delete('/delete/:id' , dbController.deleteRecord)
    .get('/get/:id' , dbController.getRecordById)
    .delete('/deleteAll' , dbController.deleteAllRecords);
  

module.exports = router;




