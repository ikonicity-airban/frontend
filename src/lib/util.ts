import { User } from "../api/types";

// get fullname
export const getFullName = (user?: User | null) =>
  `${user?.firstName} ${user?.lastName}`;
