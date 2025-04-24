import { useUser } from "@clerk/nextjs";
import { trpc } from "~/trpc/react";
import { useEffect, useState } from "react";

export const useDoesUserExist = () => {
  const { user, isLoaded: isClerkLoaded } = useUser(); // Getting the current user from Clerk
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const {
    mutateAsync: createUserMutation,
    isPending: isCreatePending,
    isError: isCreateError,
    data: createdUserData,
  } = trpc.user.createUser.useMutation();

  const {
    data: userFromDb,
    isSuccess: isSuccessUserFromDb,
    isLoading: isLoadingUserFromDb,
    refetch: refetchUser,
  } = trpc.user.findUser.useQuery(
    {
      id: user?.id as string,
    },
    {
      enabled: !!user?.id,
      retry: 1, // Limit retries to avoid excessive queries
    },
  );

  useEffect(() => {
    const createUserIfNeeded = async () => {
      // Check if the user is available from Clerk and not already creating
      if (!isClerkLoaded || !user || isCreatingUser) return;

      // If the query has completed and user doesn't exist in DB, create them
      if (isSuccessUserFromDb && !userFromDb && !isCreatePending) {
        try {
          setIsCreatingUser(true);

          const newUserData = {
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            name:
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : "User",
            image: user.imageUrl || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          };

          // Call the createUser mutation
          await createUserMutation(newUserData);
          console.log("User created successfully");

          // Refetch to get the latest user data
          await refetchUser();
        } catch (error) {
          console.error("Error creating user:", error);
        } finally {
          setIsCreatingUser(false);
        }
      }
    };

    createUserIfNeeded();
  }, [
    user,
    isClerkLoaded,
    isSuccessUserFromDb,
    userFromDb,
    createUserMutation,
    isCreatePending,
    isCreatingUser,
    refetchUser,
  ]);

  return {
    user: userFromDb || createdUserData,
    isLoading:
      isLoadingUserFromDb ||
      isCreatePending ||
      isCreatingUser ||
      !isClerkLoaded,
    isError: isCreateError,
    exists: !!userFromDb,
  };
};
