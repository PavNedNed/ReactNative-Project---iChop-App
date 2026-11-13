import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust path to your Supabase client initialization

export default function useSupabaseTable(table, { immediate = true, selectQuery = '*' } = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // READ (Fetch data)
    const fetchData = useCallback(async (query = selectQuery) => {
        setLoading(true);
        setError(null);
        try {
            const { data: result, error: fetchError } = await supabase
                .from(table)
                .select(query);

            if (fetchError) throw fetchError;
            setData(result || []);
            return result;
        } catch (err) {
            const message = err.message || 'Failed to fetch data';
            setError(message);
            Alert.alert('Error', message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [table, selectQuery]);

    // CREATE (Insert record)
    const createRecord = useCallback(async (newItem) => {
        setLoading(true);
        setError(null);
        try {
            const { data: result, error: insertError } = await supabase
                .from(table)
                .insert(newItem)
                .select(); // .select() returns the newly inserted row(s)

            if (insertError) throw insertError;

            if (result) {
                setData(prev => (Array.isArray(prev) ? [...prev, ...result] : result));
            }
            return result;
        } catch (err) {
            const message = err.message || 'Failed to create record';
            setError(message);
            Alert.alert('Error', message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [table]);

    // UPDATE (Modify record)
    const updateRecord = useCallback(async (matchColumn, matchValue, updatedFields) => {
        setLoading(true);
        setError(null);
        try {
            const { data: result, error: updateError } = await supabase
                .from(table)
                .update(updatedFields)
                .eq(matchColumn, matchValue)
                .select();

            if (updateError) throw updateError;

            if (result) {
                setData(prev =>
                    Array.isArray(prev)
                        ? prev.map(item => item[matchColumn] === matchValue ? { ...item, ...result[0] } : item)
                        : result
                );
            }
            return result;
        } catch (err) {
            const message = err.message || 'Failed to update record';
            setError(message);
            Alert.alert('Error', message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [table]);

    // DELETE (Remove record)
    const deleteRecord = useCallback(async (matchColumn, matchValue) => {
        setLoading(true);
        setError(null);
        try {
            const { error: deleteError } = await supabase
                .from(table)
                .delete()
                .eq(matchColumn, matchValue);

            if (deleteError) throw deleteError;

            setData(prev =>
                Array.isArray(prev)
                    ? prev.filter(item => item[matchColumn] !== matchValue)
                    : prev
            );
            return true;
        } catch (err) {
            const message = err.message || 'Failed to delete record';
            setError(message);
            Alert.alert('Error', message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [table]);

    // Initial fetch on mount if immediate is true
    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [immediate, fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        create: createRecord,
        update: updateRecord,
        remove: deleteRecord,
    };
}