// Utility functions for localStorage management

export const clearCorruptedStorage = () => {
  try {
    const keys = ['token', 'user'];
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value === 'undefined' || value === 'null') {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing corrupted storage:', error);
    localStorage.clear();
  }
};


// Utility functions for localStorage management
export const safeParseJSON = (jsonString, fallback = null) => {
  try {
    if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
      return fallback;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};


// Function to safely set an item in localStorage. It converts the value to a string (if it's not already) and handles any errors that may occur during the process, such as quota exceeded errors or issues with stringifying complex objects.
export const safeStorageSet = (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};


// Function to safely get an item from localStorage. It retrieves the value associated with the given key and checks if it's valid (not 'undefined' or 'null'). If the value is valid, it returns it; otherwise, it returns a specified fallback value. This function also handles any errors that may occur during the retrieval process.
export const safeStorageGet = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);
    return value && value !== 'undefined' && value !== 'null' ? value : fallback;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return fallback;
  }
};