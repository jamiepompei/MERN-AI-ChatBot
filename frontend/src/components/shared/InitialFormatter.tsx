export const formatNameToInitials = (name: string | undefined): string => {
    if (!name) return "";
    const [firstName, lastName] = name.split(" ");
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`;
};