import { useState, useEffect, useCallback } from 'react';
import { getTransactionsByMonth, addTransaction, deleteTransaction, updateTransaction } from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext';

export const useTransactions = (currentMonth) => { // format 'YYYY-MM'
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getTransactionsByMonth(currentUser.uid, currentMonth);
            setTransactions(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentUser, currentMonth]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTx = async (data) => {
        if (!currentUser) return;
        try {
            await addTransaction(currentUser.uid, data);
            await fetchTransactions(); // refresh list
        } catch (err) {
            throw err;
        }
    };

    const updateTx = async (id, data) => {
        if (!currentUser) return;
        try {
            await updateTransaction(currentUser.uid, id, data);
            await fetchTransactions(); // refresh list
        } catch (err) {
            throw err;
        }
    };

    const deleteTx = async (id) => {
        if (!currentUser) return;
        try {
            await deleteTransaction(currentUser.uid, id);
            await fetchTransactions(); // refresh list
        } catch (err) {
            throw err;
        }
    };

    return { transactions, loading, error, addTx, updateTx, deleteTx, refetch: fetchTransactions };
};
