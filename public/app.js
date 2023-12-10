// app.js
document.addEventListener('DOMContentLoaded', fetchTransactions);

function fetchTransactions() {
  fetch('/api/transactions')
    .then(response => response.json())
    .then(transactions => {
      const transactionList = document.getElementById('transaction-list');
      transactionList.innerHTML = '';
        let total =0;
      transactions.forEach(transaction => {
        const listItem = document.createElement('div');
        listItem.classList.add('bg-light','text-dark','rounded','p-2' ,'m-2','item')
        listItem.innerHTML = `  <span class="fs-5"> ${transaction.createdAt.slice(0,10)}</span>
         <span class="fs-5"> ${transaction.text}</span> <span class="fs-5">${formatCurrency(transaction.amount)}</span>
          <div>

          <button onclick="editTransaction('${transaction._id}', '${transaction.text}', ${transaction.amount})" class="border rounded p-2 text-info">
          <i class="fa-solid fa-edit"></i>
          </button>
          <button onclick="deleteTransaction('${transaction._id}')" class="border rounded p-2 text-danger">
          <i class="fa-solid fa-trash"></i>
          </button>
          </div>
        `;
        transactionList.appendChild(listItem);
        total+=transaction.amount;
      });
      document.getElementById('total').innerText = `Total: ${formatCurrency(total)}`;
    })
    .catch(error => console.error('Error fetching transactions:', error));
}

function addTransaction() {
  const text = document.getElementById('text').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (text && !isNaN(amount)) {
    const transaction = {
      text,
      amount,
    };

    fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    })
      .then(response => response.json())
      .then(() => {
        fetchTransactions();
        document.getElementById('text').value = '';
        document.getElementById('amount').value = '';
      })
      .catch(error => console.error('Error adding transaction:', error));
  } else {
    alert('Please enter valid text and amount.');
  }
}

function editTransaction(id, text, amount) {
  const newText = prompt('Enter new text:', text);
  const newAmount = parseFloat(prompt('Enter new amount:', amount));

  if (newText !== null && !isNaN(newAmount)) {
    const updatedTransaction = {
      text: newText,
      amount: newAmount,
    };

    fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTransaction),
    })
      .then(response => response.json())
      .then(() => fetchTransactions())
      .catch(error => console.error('Error editing transaction:', error));
  }
}

function deleteTransaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => fetchTransactions())
      .catch(error => console.error('Error deleting transaction:', error));
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

