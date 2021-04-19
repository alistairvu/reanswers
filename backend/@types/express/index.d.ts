declare namespace Express {
  interface Request {
    io: import("socket.io").Server
    user: import("../../modules/user/user.model").UserSchemaInterface
  }
}
