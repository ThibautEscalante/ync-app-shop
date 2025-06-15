import { createContext } from 'react';
import axios from 'axios';

// init Context
const FrenchGovAPI = createContext();

export const FrenchGovAPI = ({ children }) => {
    return (
        <FrenchGovAPI.Provider value={{ fetchSuggestions, fetchAddress }}>
            {children}
        </FrenchGovAPI.Provider>
    );
};

export default FrenchGovAPI;
