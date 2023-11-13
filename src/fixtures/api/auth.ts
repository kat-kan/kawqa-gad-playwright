export const testUsers = {
  regularUser: {
    email: process.env.USER_EMAIL ?? "[NOT SET]",
    password: process.env.USER_PASSWORD ?? "[NOT SET]",
    id: process.env.USER_ID ?? "[NOT SET]",
  },
  admin: {
    email: process.env.ADMIN_EMAIL ?? "[NOT SET]",
    password: process.env.ADMIN_PASSWORD ?? "[NOT SET]",
    id: process.env.ADMIN_ID ?? "[NOT SET]",
  }
};
