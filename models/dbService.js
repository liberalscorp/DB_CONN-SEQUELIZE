const User = require('./User_table'); 

class DbService {
    static getDbServiceInstance() {
        return this.instance ? this.instance : new DbService();
    }

    async insertRecord(name, age ) {
        try {
            const dateAdded = new Date();
            //console.log("in func")
            const user = await User.create({ name, age, date_added: dateAdded });
            //console.log(user);
            return user.toJson();
        } catch (error) {
            console.error(error);
        }
    }

    async getAllData() {
        try {
            const users = await User.findAll();
          //  console.log(users);
            return users.map((user) => user.toJson());
        } catch (error) {
            console.error(error);
        }
    }

    async updateRecord(id, name, age) {
        try {
            const [affectedRows] = await User.update(
                { name, age },
                { where: { id } }
            );
            return affectedRows === 1;
        } catch (error) {
            console.error(error);
        }
    }

    async deleteRecord(id) {
        try {
            const affectedRows = await User.destroy({ where: { id } });
            return affectedRows === 1;
        } catch (error) {
            console.error(error);
        }
    }

    async getRecordById(id) {
        try {
            const user = await User.findOne(id);
            return user;
        } catch (error) {
            console.error(error);
        }
    }

    async deleteAllRecords() {
        try {
            await User.destroy({ where: {} });
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
module.exports = DbService;
