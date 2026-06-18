import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../components/App";

it("adds a new transaction and calls POST", async () => {
  // The app should initially render this transaction from the mock backend.
  const initialTransactions = [
    {
      id: "1",
      date: "2019-12-01",
      description: "Paycheck from Bob's Burgers",
      category: "Income",
      amount: 1000,
    },
  ];

  // Transaction object representing the form submission payload.
  const newTransaction = {
    id: "2",
    date: "2019-12-10",
    description: "Coffee at Flatiron Cafe",
    category: "Food",
    amount: -4.5,
  };

  // Mock the sequence of fetch calls: initial GET, then POST.
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({
      json: () => Promise.resolve(initialTransactions),
      ok: true,
      status: 200,
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve(newTransaction),
      ok: true,
      status: 201,
    });

  global.fetch = fetchMock;

  render(<App />);

  // Verify the app has loaded the initial transaction before filling the form.
  expect(await screen.findByText("Paycheck from Bob's Burgers")).toBeInTheDocument();

  // Fill in the form and submit it.
  await userEvent.type(screen.getByRole("textbox", { name: /description/i }), "Coffee at Flatiron Cafe");
  await userEvent.type(screen.getByRole("textbox", { name: /category/i }), "Food");
  await userEvent.type(screen.getByRole("spinbutton", { name: /amount/i }), "-4.5");
  await userEvent.type(screen.getByLabelText(/date/i), "2019-12-10");

  await userEvent.click(screen.getByRole("button", { name: /add transaction/i }));

  // Ensure the app made the expected POST request.
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  expect(fetchMock.mock.calls[1][0]).toBe("http://localhost:6001/transactions");
  expect(fetchMock.mock.calls[1][1].method).toBe("POST");

  const postedBody = JSON.parse(fetchMock.mock.calls[1][1].body);
  expect(postedBody).toEqual({
    date: "2019-12-10",
    description: "Coffee at Flatiron Cafe",
    category: "Food",
    amount: "-4.5",
  });

  // Confirm the new transaction was rendered after submission.
  expect(await screen.findByText("Coffee at Flatiron Cafe")).toBeInTheDocument();
});
