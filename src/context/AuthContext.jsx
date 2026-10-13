// src/context/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

const AuthContext = createContext();


export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);

  const [userProfile, setUserProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [logoutLoading, setLogoutLoading] = useState(false);


  /* =====================================================
     AUTHENTICATION STATE
  ===================================================== */

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {

        try {

          setLoading(true);

          setCurrentUser(user);


          /* =================================================
             USER LOGGED OUT
          ================================================= */

          if (!user) {

            setUserProfile(null);

            return;
          }


          /* =================================================
             FIRESTORE USER PROFILE
          ================================================= */

          const userRef = doc(
            db,
            "users",
            user.uid
          );

          const userSnapshot = await getDoc(
            userRef
          );


          /* =================================================
             PROFILE EXISTS
          ================================================= */

          if (userSnapshot.exists()) {

            const profile = userSnapshot.data();

            setUserProfile(profile);

            return;
          }


          /* =================================================
             PROFILE DOES NOT EXIST
          ================================================= */

          const newProfile = {

            displayName:
              user.displayName || "",

            email:
              user.email || "",

            role:
              "member",

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),

          };


          await setDoc(
            userRef,
            newProfile
          );


          /* =================================================
             LOCAL PROFILE
          ================================================= */

          setUserProfile({

            displayName:
              newProfile.displayName,

            email:
              newProfile.email,

            role:
              newProfile.role,

            createdAt:
              null,

            updatedAt:
              null,

          });

        } catch (error) {

          console.error(
            "Authentication/profile error:",
            error
          );

          setUserProfile(null);

        } finally {

          setLoading(false);

        }

      }
    );


    return unsubscribe;

  }, []);


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = async () => {

    try {

      setLogoutLoading(true);

      await signOut(auth);

      /*
       * onAuthStateChanged will automatically:
       *
       * currentUser -> null
       * userProfile -> null
       *
       * We don't manually change them here because
       * Firebase is the source of truth.
       */

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      throw error;

    } finally {

      setLogoutLoading(false);

    }

  };


  /* =====================================================
     CONTEXT
  ===================================================== */

  return (

    <AuthContext.Provider
      value={{

        currentUser,

        userProfile,

        loading,

        logout,

        logoutLoading,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


/* =======================================================
   AUTH HOOK
======================================================= */

export function useAuth() {

  return useContext(
    AuthContext
  );

}
