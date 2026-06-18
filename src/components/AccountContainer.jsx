import React, { useState, useEffect } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("description");

  useEffect(() => {
    fetch("http://localhost:6001/transactions")
      .then((r) => r.json())
      .then((data) => setTransactions(data));
  }, []);

  function postTransaction(newTransaction) {
    fetch("http://localhost:6001/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    })
      .then((r) => r.json())
      .then((data) => setTransactions((prevTransactions) => [...prevTransactions, data]));
  }

  function onSort(sortValue) {
    setSortBy(sortValue);
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const query = search.toLowerCase();

    if (query === "") return true;

    return (
      transaction.description.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.date.toLowerCase().includes(query) ||
      String(transaction.amount).toLowerCase().includes(query)
    );
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = String(a[sortBy]).toLowerCase();
    const bValue = String(b[sortBy]).toLowerCase();

    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  });

  return (
    <div>
      <Search setSearch={setSearch} />
      <AddTransactionForm postTransaction={postTransaction} />
      <Sort onSort={onSort} />
      <TransactionsList transactions={sortedTransactions} />
    </div>
  );
}

export default AccountContainer;
