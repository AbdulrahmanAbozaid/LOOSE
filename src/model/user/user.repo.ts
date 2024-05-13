import Users, { User } from "./model"

/*
export interface AuthService {
  signup(userData: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
  }>;

  login(credentials: {
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
  }>;

  forgotPassword(
    email: string
  ): Promise<{ success: boolean; message?: string }>;

  verifyForgotPasswordOTP(
    OTP: string
  ): Promise<{ success: boolean; token?: string }>;

  resetPassword(
    token: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
  }>;
}
*/

/**
 * UserRepository
 * @description: a class to separate database access from business logic,
 * so as to be able to switch database system or farther
 */
class UserRepository {
  // Method to find all users
  async findAll(): Promise<any[]> {
    return await Users.find();
  }

  // Method to find user by email
  async findByEmail(email: string): Promise<any> {
    return await Users.findOne({ email }).select("+password");
  }

  // Method to find a user by ID
  async findById(id: string): Promise<any | null> {
    return await Users.findById(id);
  }

  // Method to create a new user
  async create(data: any): Promise<any> {
    return await Users.create(data);
  }

  // Method to update a user by ID
  async update(id: string, data: any): Promise<any | null> {
    return await Users.findByIdAndUpdate(id, data, { new: true });
  }

  // Method to delete a user by ID
  async delete(id: string): Promise<void> {
    await Users.findByIdAndDelete(id);
  }

  async findOne(props: object): Promise<any | null> {
	return Users.findOne(props);
  }
}

export default new UserRepository();
