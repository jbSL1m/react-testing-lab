import { render, screen } from "@testing-library/react";
import App from "../../components/App";

// Mock transaction data used to verify the app displays transaction rows.
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
    description: "Lyft Ride",
    category: "Transportation",
    amount: -13.25,
  },
];

it("displays transactions on load", async () => {
  // Provide the mocked backend response before rendering the app.
  setFetchResponse(transactions);

  render(<App />);

  // Confirm the transaction descriptions appear in the DOM.
  expect(await screen.findByText("Paycheck from Bob's Burgers")).toBeInTheDocument();
  expect(await screen.findByText("Lyft Ride")).toBeInTheDocument();
});
