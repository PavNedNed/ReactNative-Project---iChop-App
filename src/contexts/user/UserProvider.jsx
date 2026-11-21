import { useEffect, useState } from 'react';

import { UserContext } from './UserContext';
import { supabase } from '../../lib/supabase';

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [recipesUpdated, setRecipesUpdated] = useState(0);
    const [detailsUpdated, setDetailsUpdated] = useState(0);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setAuthLoading(false);

            console.log('Auth event:', event);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    function refreshRecipes() {
        setRecipesUpdated(prev => prev + 1);
    }

    function refreshDetails() {
        setDetailsUpdated(prev => prev + 1);
    }

    const contextData = {
        isAuthenticated: !!user,
        user,
        session,
        authLoading,
        recipesUpdated,
        refreshRecipes,
        detailsUpdated,
        refreshDetails,
    };

    return (
        <UserContext.Provider value={contextData}>
            {children}
        </UserContext.Provider>
    );
}