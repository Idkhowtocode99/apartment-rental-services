// Auth Module
const Auth = (function () {
    // Private variables and functions
    const storageKey = "apartmentfinder_auth";
  
    // Initialize default users if none exist
    function initializeUsers() {
      if (!localStorage.getItem("apartmentfinder_users")) {
        const defaultUsers = [
          {
            id: 1,
            name: "Admin",
            email: "admin@apartmentfinder.com",
            password: "admin123",
            role: "admin",
          },
        ];
  
        localStorage.setItem(
          "apartmentfinder_users",
          JSON.stringify(defaultUsers),
        );
      }
    }
  
    // Initialize admin user if needed
    function initializeAdminUser() {
      initializeUsers();
  
      // Check if admin user exists
      const users = JSON.parse(
        localStorage.getItem("apartmentfinder_users") || "[]",
      );
      const adminExists = users.some((user) => user.role === "admin");
  
      if (!adminExists) {
        // Add admin user
        const adminUser = {
          id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
          name: "Admin User",
          email: "admin@apartmentfinder.com",
          password: "admin123", // In a real app, this would be hashed
          role: "admin",
        };
  
        users.push(adminUser);
        localStorage.setItem("apartmentfinder_users", JSON.stringify(users));
      }
    }
  
    // Public API
    return {
      initializeAdminUser: initializeAdminUser,
  
      register: function (name, email, password) {
        initializeUsers();
  
        // Get existing users
        const users = JSON.parse(
          localStorage.getItem("apartmentfinder_users") || "[]",
        );
  
        // Check if email already exists
        if (users.some((user) => user.email === email)) {
          return { success: false, message: "Email already registered" };
        }
  
        // Create new user (all new registrations are tenants)
        const newUser = {
          id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
          name,
          email,
          password, // In a real app, this would be hashed
          role: "tenant", // All new users are tenants by default
        };
  
        // Add user to storage
        users.push(newUser);
        localStorage.setItem("apartmentfinder_users", JSON.stringify(users));
  
        // Log in the new user
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem(storageKey, JSON.stringify(userWithoutPassword));
  
        return { success: true, user: userWithoutPassword };
      },
  
      login: function (email, password) {
        initializeUsers();
  
        // Get users
        const users = JSON.parse(
          localStorage.getItem("apartmentfinder_users") || "[]",
        );
  
        // Find user by email and password
        const user = users.find(
          (user) => user.email === email && user.password === password,
        );
  
        if (!user) {
          return { success: false, message: "Invalid email or password" };
        }
  
        // Store user info in local storage (without password)
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem(storageKey, JSON.stringify(userWithoutPassword));
  
        return { success: true, user: userWithoutPassword };
      },
  
      logout: function () {
        localStorage.removeItem(storageKey);
      },
  
      isLoggedIn: function () {
        return localStorage.getItem(storageKey) !== null;
      },
  
      getCurrentUser: function () {
        return JSON.parse(localStorage.getItem(storageKey) || "null");
      },
  
      isAdmin: function () {
        const user = this.getCurrentUser();
        return user && user.role === "admin";
      },
  
      isLandlord: function () {
        const user = this.getCurrentUser();
        return user && (user.role === "landlord" || user.role === "admin");
      },
  
      updateUser: function (userData) {
        if (!this.isLoggedIn()) {
          return { success: false, message: "Not logged in" };
        }
  
        const currentUser = this.getCurrentUser();
        const users = JSON.parse(
          localStorage.getItem("apartmentfinder_users") || "[]",
        );
  
        // Find and update user
        const userIndex = users.findIndex((user) => user.id === currentUser.id);
  
        if (userIndex === -1) {
          return { success: false, message: "User not found" };
        }
  
        // Update user data
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem("apartmentfinder_users", JSON.stringify(users));
  
        // Update current user in session
        const { password: _, ...updatedUser } = users[userIndex];
        localStorage.setItem(storageKey, JSON.stringify(updatedUser));
  
        return { success: true, user: updatedUser };
      },
  
      getAllUsers: function () {
        if (!this.isAdmin()) {
          return { success: false, message: "Unauthorized" };
        }
  
        const users = JSON.parse(
          localStorage.getItem("apartmentfinder_users") || "[]",
        );
  
        // Remove passwords before returning
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  
        return { success: true, users: usersWithoutPasswords };
      },
    };
  })();
