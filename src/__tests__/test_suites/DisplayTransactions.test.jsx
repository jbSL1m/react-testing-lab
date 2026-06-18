import { render, screen } from "@testing-library/react";
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
    description: "Lyft Ride",
    category: "Transportation",
    amount: -13.25,
  },
];

it("displays transactions on load", async () => {
  setFetchResponse(transactions);

  render(<App />);

  expect(await screen.findByText("Paycheck from Bob's Burgers")).toBeInTheDocument();
  expect(await screen.findByText("Lyft Ride")).toBeInTheDocument();
});
