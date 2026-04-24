import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");

  const [borrower, setBorrower] = useState("");
  const [days, setDays] = useState("");
  const [purpose, setPurpose] = useState("");

  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const [itemCondition, setItemCondition] = useState("");
  const [remarks, setRemarks] = useState("");
  const [returnItemId, setReturnItemId] = useState(null);

  const API = "http://localhost:8081/items";

  const fetchItems = async () => {
    const res = await axios.get(API);
    setItems(res.data);
  };

  useEffect(() => {
  fetchItems();
}, []);

useEffect(() => {
  checkDueReminders();
}, [items]);
  // ADD ITEM
  const addItem = async () => {
    if (!name || !owner) {
      alert("Enter name & owner");
      return;
    }

    await axios.post(API, {
      name,
      owner,
      description,
      category,
      quantity,
    });

    setName("");
    setOwner("");
    setDescription("");
    setCategory("");
    setQuantity("");

    fetchItems();
  };

  // BORROW
  const borrowItem = async (id) => {
    if (!borrower || !days) {
      alert("Enter borrower & duration");
      return;
    }

    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + parseInt(days));

    const dueDate = due.toISOString().split("T")[0];

    await axios.put(`${API}/borrow/${id}`, {
      borrower,
      dueDate,
      purpose,
    });

    setBorrower("");
    setDays("");
    setPurpose("");

    fetchItems();
  };
const checkDueReminders = () => {
  const today = new Date();

  items.forEach(item => {
    if (item.dueDate && item.status === "Out of Stock") {
      const due = new Date(item.dueDate);

      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        alert(`⏰ Reminder: "${item.name}" is due TOMORROW!`);
      }

      if (diffDays === 0) {
        alert(`🚨 ALERT: "${item.name}" is due TODAY!`);
      }
    }
  });
};
  // RETURN
  const returnItem = async () => {
    if (!returnItemId) {
      alert("Select item first");
      return;
    }

    if (!itemCondition) {
      alert("Select condition");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    await axios.put(`${API}/return/${returnItemId}`, {
      returnDate: today,
      itemCondition,
      remarks,
    });

    setItemCondition("");
    setRemarks("");
    setReturnItemId(null);

    fetchItems();
  };

  // LOGIN SYSTEM
  if (!user) {
    return isSignup ? (
      <Signup
        onSignup={() => setIsSignup(false)}
        switchToLogin={() => setIsSignup(false)}
      />
    ) : (
      <Login
        onLogin={setUser}
        switchToSignup={() => setIsSignup(true)}
      />
    );
  }

  // STATS
  const totalItems = items.length;
  const availableItems = items.filter(i => i.status === "Available").length;
  const borrowedItems = items.filter(i => i.status === "Out of Stock").length;

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <h2>📚 Resource Library</h2>
        <div>
          <span>👤 {user}</span>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div>Total: {totalItems}</div>
        <div>Available: {availableItems}</div>
        <div>Borrowed: {borrowedItems}</div>
      </div>

      {/* ADD ITEM */}
      <h3>Add Item</h3>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Owner" value={owner} onChange={e => setOwner(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <input type="number" placeholder="Qty" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <button onClick={addItem}>Add</button>

      {/* BORROW */}
      <h3>Borrow</h3>
      <input placeholder="Borrower" value={borrower} onChange={e => setBorrower(e.target.value)} />
      <input type="number" placeholder="Days" value={days} onChange={e => setDays(e.target.value)} />
      <input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} />

      {/* RETURN */}
      <h3>Return</h3>

      <select onChange={(e) => setItemCondition(e.target.value)}>
        <option value="">Condition</option>
        <option value="Good">Good</option>
        <option value="Damaged">Damaged</option>
      </select>

      <input
        placeholder="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      {returnItemId && <p>Selected ID: {returnItemId}</p>}

      <button onClick={returnItem}>Confirm Return</button>

      {/* ITEMS */}
      <h3>Items</h3>

      {items.map(item => (
        <div key={item.id} className="item-card">

          <h4>{item.name} ({item.owner})</h4>

          <p>
  Status:{" "}
  <span
    className={
      item.status === "Available" ? "available" : "borrowed"
    }
  >
    {item.status === "Available" ? "🟢 Available" : "🔴 Out of Stock"}
  </span>
</p>
          <p>Description: {item.description}</p>
          <p>Category: {item.category}</p>

          {item.borrower && (
            <p>Borrower: {item.borrower} | Due: {item.dueDate}</p>
          )}

          {item.returnDate && (
            <p>Returned: {item.returnDate}</p>
          )}

          <button
            disabled={item.status === "Out of Stock"}
            onClick={() => borrowItem(item.id)}
          >
            Borrow
          </button>

          <button
            disabled={item.status !== "Out of Stock"}
            onClick={() => setReturnItemId(item.id)}
          >
            Return
          </button>

        </div>
      ))}

    </div>
  );
}

export default App;