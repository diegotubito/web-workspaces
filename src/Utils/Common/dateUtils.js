
export const stringMonthFormat = (dateString) => {
    // Parse the ISO string into a Date object
    const date = new Date(dateString);
    // Prepare an array of month names (like having a spellbook of names)
    const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
  
    // Extract the day, month, and year from the date
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    // Construct a new date string in the desired format
    return `${month} ${day}, ${year}`; // e.g., "February 17, 2024"
  };

  export const dateAndTimeFormat = (dateString) => {
    const date = new Date(dateString);
  
    // Extract local date components
    const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, add 1
    const year = date.getFullYear();
  
    // Extract local time components
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    // Construct the formatted string in local time
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

export const dateFormat = (dateString) => {
  const date = new Date(dateString);

  // Extract local date components
  const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, add 1
  const year = date.getFullYear();

  // Construct the formatted string in local time
  return `${day}/${month}/${year}`;
};