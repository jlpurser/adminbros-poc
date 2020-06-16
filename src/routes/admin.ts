import AdminBro from 'admin-bro';
// using require because library is not typed
const { buildRouter } = require('admin-bro-expressjs');

export const buildAdminRouter = (admin: AdminBro) => buildRouter(admin);
