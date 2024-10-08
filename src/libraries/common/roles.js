const allRoles = {
  user: ["getInfluencers"],
  admin: ["getUsers", "manageUsers", "manageInfluencers"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
