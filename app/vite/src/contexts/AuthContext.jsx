import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

function getStoredUser() {
  const storedUser =
    localStorage.getItem('@finance:user') ||
    sessionStorage.getItem('@finance:user');

  return storedUser ? JSON.parse(storedUser) : null;
}

function persistUser(user) {
  if (localStorage.getItem('@finance:token')) {
    localStorage.setItem('@finance:user', JSON.stringify(user));
  }

  if (sessionStorage.getItem('@finance:token')) {
    sessionStorage.setItem('@finance:user', JSON.stringify(user));
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  function signIn(data, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('@finance:token', data.token);
    storage.setItem('@finance:user', JSON.stringify(data.user));

    setUser(data.user);
  }

  function updateUser(userData) {
    setUser(userData);
    persistUser(userData);
  }

  function signOut() {
    localStorage.removeItem('@finance:token');
    localStorage.removeItem('@finance:user');
    sessionStorage.removeItem('@finance:token');
    sessionStorage.removeItem('@finance:user');

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
