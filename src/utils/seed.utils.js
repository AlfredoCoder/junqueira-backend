import { AuthService } from "../services/auth.services.js";


export const seedAdminUser = async () => {
  const adminData = {
    name: "Emanuel Malungo",
    username: "emalungo",
    email: "emanuelmalungo856@gmail.com",
    password: "Emalungo@123",
    tipo: 0
  };

  try {
    const user = await AuthService.registerUser(adminData);
    console.log("Admin user created successfully:", user);
    return user;
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    throw error;
  }
};
