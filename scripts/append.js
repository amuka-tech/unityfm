const fs = require('fs');
const guard = `
export async function requirePermission(requiredPermission: Permission) {
  const session = await getServerSession();
  if (!session) {
    throw new Error('UNAUTHORIZED: No active session');
  }

  const userPermissions = ROLE_PERMISSIONS[session.role as UserRole];
  if (!userPermissions || !userPermissions.includes(requiredPermission)) {
    console.warn(\`[SECURITY] Role '\${session.role}' attempted '\${requiredPermission}' without authorization.\`);
    throw new Error('FORBIDDEN: Insufficient privileges');
  }

  return session;
}
`;
fs.appendFileSync('d:/Unitytvsite/src/lib/auth-server.ts', guard);
console.log('Appended');
