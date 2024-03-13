import React, { createContext, useContext, useEffect, useState } from "react";
import userIconPlaceholder from "../images/Profile_avatar_placeholder_large.png";
import { spotify } from "./api/spotifyAPI";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({
        userName: "unknown",
        userIcon: userIconPlaceholder,
    });
    const [loginURL, setLoginURL] = useState("");

    useEffect(() => {
        spotify
            .isAuthenticated()
            .then((data) => {
                const { status } = data;
                setIsLoggedIn(status);
                if (status) {
                    spotify.getCurrentUser().then((userdata) => {
                        setUser((prev) => ({
                            ...prev,
                            userName: userdata.display_name ?? "unknown",
                            userIcon:
                                userdata.images[0].url ?? userIconPlaceholder,
                        }));
                    });
                }
            })
            .catch((error) => {
                console.error("Error checking authentication", error);
            });
    }, []);

    useEffect(() => {
        spotify
            .login()
            .then((data) => {
                setLoginURL(data.url);
            })
            .catch((error) => {
                console.error("Error fetching login URL", error);
                throw error;
            });
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loginURL }}>
            {children}
        </AuthContext.Provider>
    );
};
