
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function useSupabaseAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            setError(err.message);
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, additionalData = {}) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: additionalData,
                },
            });

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            setError(err.message);
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signOut();

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            setError(err.message);
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        login,
        register,
        logout,
        loading,
        error,
        clearError,
    };
}
