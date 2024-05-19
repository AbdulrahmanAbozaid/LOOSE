import Users from "./model";
class UserRepository {
    async findAll() {
        return await Users.find();
    }
    async findByEmail(email) {
        return await Users.findOne({ email }).select("+password");
    }
    async findById(id) {
        return await Users.findById(id);
    }
    async create(data) {
        return await Users.create(data);
    }
    async update(id, data) {
        return await Users.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await Users.findByIdAndDelete(id);
    }
    async findOne(props) {
        return Users.findOne(props);
    }
}
export default new UserRepository();
