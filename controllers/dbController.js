const dbService = require('../models/dbService');

exports.insertNewRecord = async (req, res) => {
    
    try{
        const db = dbService.getDbServiceInstance();
        const {name, age} = req.body;
        console.log(name, age);
        const data = await db.insertRecord(name, age);
        res.json({data: data});

    }catch(error){
        console.log("InsertRecord :" + error);
    }
};


exports.getAllData = async (req, res) => {
    try{
        const db = dbService.getDbServiceInstance();
        const data = await db.getAllData();
        res.json({data: data});

    }catch(error){
        console.log("GetAllData :" + error);
    }
};
exports.updateRecord = async (req, res) => {
    try {
        const db = dbService.getDbServiceInstance();
        const { id, name, age } = req.body;
        const existingRecord = await db.getRecordById(id);

        // Use existing values if new values are not provided
        const updatedName = name || existingRecord.name;
        const updatedAge = age || existingRecord.age;

        // Perform the update with the updated values
        const data = await db.updateRecord(id, updatedName, updatedAge);
        
        res.json({ data: data });
    } catch (error) {
        console.log("UpdateRecord :" + error);
    }
};

exports.deleteRecord = async (req, res) => {
    try{
        const db = dbService.getDbServiceInstance();
        const {id} = req.params;
        const data = await db.deleteRecord(id);
        res.json({data: data});

    }catch(error){
        console.log("DeleteRecord :" + error);
    }
};

exports.getRecordById = async (req, res) => {
    try{
        const db = dbService.getDbServiceInstance();
        const {id} = req.params;
        const data = await db.getRecordById(id);
        res.json({data: data});

    }catch(error){
        console.log("GetRecordById :" + error);
    }
};

exports.deleteAllRecords = async (req, res) => {
    try{
        const db = dbService.getDbServiceInstance();
        const data = await db.deleteAllRecords();
        res.json({data: data});

    }catch(error){
        console.log("DeleteAllRecords :" + error);
    }
}