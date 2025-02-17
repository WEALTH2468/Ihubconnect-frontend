/**
 * Authorization Roles
 * 
 * This object defines the roles and their associated authorization levels
 * for role-based access control (RBAC) within the application.
 * Each key represents an authorization level, and the value is an array
 * of roles that are permitted to access that level.
 * 
 * Example:
 * - 'admin' level can only be accessed by users with the 'admin' role.
 * - 'employee' level can be accessed by 'admin', 'team lead', and 'employee' roles.
 * - 'guest' has no authorized roles, meaning it is completely restricted.
 */
const authRoles = {
    superAdmin: ['super admin', 'admin'],
    admin: ['super admin', 'admin'],
    teamLead: ['super admin', 'admin', 'team lead', "manager"],
    employee: ['super admin', 'admin', 'team lead', "manager", 'staff'],
    manager: ["super admin", "admin", "manager"],
    customer: ['super admin', 'admin', 'team lead', 'staff',  'manager', 'customer'],
    guest: [],
};

export default authRoles;
