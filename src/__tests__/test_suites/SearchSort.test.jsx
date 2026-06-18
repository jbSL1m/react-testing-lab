import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../components/App";

const transactions = [
  {
    id: "1",
    date: "2019-12-01",
    description: "Paycheck from Bob's Burgers",
    category: "Income",
    amount: 1000,
  },
  {
    id: "2",
    date: "2019-12-02",
    description: "Coffee at Flatiron Cafe",
    category: "Food",
    amount: -4.5,
  },
  {
    id: "3",
    date: "2019-12-03",
    description: "Birthday Check from Grandma",
    category: "Gift",
    amount: 50,
  },
];

it("filters displayed transactions when search input changes", async () => {
  setFetchResponse(transactions);
  render(<App />);

  expect(await screen.findByText("Paycheck from Bob's Burgers")).toBeInTheDocument();

  const searchInput = screen.getByPlaceholderText(/Search your Recent Transactions/i);
  await userEvent.type(searchInput, "coffee");

  expect(screen.getByText("Coffee at Flatiron Cafe")).toBeInTheDocument();
  expect(screen.queryByText("Paycheck from Bob's Burgers")).not.toBeInTheDocument();
});

it("sorts transactions by category when the sort select changes", async () => {
  setFetchResponse(transactions);
  render(<App />);

  expect(await screen.findByText("Paycheck from Bob's Burgers")).toBeInTheDocument();

  const sortSelect = screen.getByRole("combobox");
  await userEvent.selectOptions(sortSelect, "category");

  await waitFor(() => {
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Coffee at Flatiron Cafe");
    expect(rows[2]).toHaveTextContent("Birthday Check from Grandma");
    expect(rows[3]).toHaveTextContent("Paycheck from Bob's Burgers");
  });
});
