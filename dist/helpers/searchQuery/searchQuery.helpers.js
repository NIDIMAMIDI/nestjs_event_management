"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const query = async (title, date, location, capacity) => {
    const searchQuery = {}; // Create an empty query object
    // Check if title is provided and add to query
    if (title && title.trim()) {
        searchQuery.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }
    // Check if date is provided and is a valid date string
    if (date && !isNaN(Date.parse(date))) {
        searchQuery.date = new Date(date); // Convert string to Date object
    }
    // Check if location is provided and add to query
    if (location && location.trim()) {
        searchQuery.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }
    // Check if capacity is a valid number
    if (typeof capacity === 'number' && capacity > 0) {
        searchQuery.capacity = capacity;
    }
    return searchQuery; // Return the constructed query object
};
exports.query = query;
//# sourceMappingURL=searchQuery.helpers.js.map