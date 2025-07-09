import { clerkClient } from '@clerk/express';


export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await clerkClient.users.getUser(userId);

    if (!user || user.publicMetadata.role !== 'educator') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    req.user = {
      _id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName + ' ' + user.lastName
    };
    next();
  } catch (error) {
    console.error('Educator middleware error:', error);
    res.status(500).json({ success: false, message: 'Internal middleware error' });
  }
};
