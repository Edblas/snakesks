
/**
 * Format date to be more readable
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Format user ID to be more readable (truncate and show only part of the address)
 */
export const formatUserId = (userId: string) => {
  return `${userId.substring(0, 6)}...${userId.substring(userId.length - 4)}`;
};
