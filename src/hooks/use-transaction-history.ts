import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  tx_hash: string | null;
  from_address: string | null;
  to_address: string | null;
  price_inr: number | null;
  created_at: string;
}

export function useTransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add a new transaction to the database
  const addTransaction = useCallback(
    async (transaction: {
      type: string;
      amount: number;
      tx_hash?: string;
      from_address?: string;
      to_address?: string;
      price_inr?: number;
    }) => {
      if (!user) return { success: false, error: "Not authenticated" };

      try {
        const { data, error } = await supabase.from("transactions").insert({
          user_id: user.id,
          type: transaction.type,
          amount: transaction.amount,
          tx_hash: transaction.tx_hash || null,
          from_address: transaction.from_address || null,
          to_address: transaction.to_address || null,
          price_inr: transaction.price_inr || null,
        }).select().single();

        if (error) throw error;

        // Add to local state immediately
        setTransactions((prev) => [data, ...prev]);

        return { success: true, data };
      } catch (err: any) {
        console.error("Error adding transaction:", err);
        return { success: false, error: err.message };
      }
    },
    [user]
  );

  // Set up realtime subscription for transactions
  useEffect(() => {
    if (!user) return;

    fetchTransactions();

    const channel = supabase
      .channel("transactions-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setTransactions((prev) => [payload.new as Transaction, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
  };
}
