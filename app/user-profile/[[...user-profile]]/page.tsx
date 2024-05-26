import { SignOutButton, UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div>
    <UserProfile path="/user-profile" />
    <SignOutButton />
  </div>
  
);

export default UserProfilePage;