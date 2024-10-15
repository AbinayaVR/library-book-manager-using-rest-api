// Replace this with your CrudCrud API endpoint
const apiUrl = 'https://crudcrud.com/api/17aa4fbe2ab34e84acf8f909ba4dfeb2/libraryBooks';

const bookForm = document.getElementById('bookForm');
const bookTitle = document.getElementById('bookTitle');
const bookAuthor = document.getElementById('bookAuthor');
const bookStatus = document.getElementById('bookStatus');
const bookList = document.getElementById('bookList');
let editingBookId = null; // To track the book being edited

// Fetch all books from CrudCrud and display them
async function fetchBooks() {
    try {
        const response = await axios.get(apiUrl);
        bookList.innerHTML = ''; // Clear the list before displaying
        response.data.forEach(book => displayBookItem(book));
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Add or update a book
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newBook = {
        title: bookTitle.value,
        author: bookAuthor.value,
        status: bookStatus.value
    };
    
    try {
        if (editingBookId) {
            // Update existing book (PUT request)
            await axios.put(`${apiUrl}/${editingBookId}`, newBook);
            editingBookId = null; // Reset after updating
        } else {
            // Add new book (POST request)
            const response = await axios.post(apiUrl, newBook);
            displayBookItem(response.data);
        }
        
        // Clear the input fields after adding/updating
        bookTitle.value = ''; 
        bookAuthor.value = '';
        bookStatus.value = '';
        fetchBooks(); // Refresh the list after adding/updating
    } catch (error) {
        console.error('Error adding/updating book:', error);
    }
});

// Display a book in the list
function displayBookItem(book) {
    const li = document.createElement('li');
    li.textContent = `${book.title} by ${book.author} - Status: ${book.status}`;

    // Create Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => loadBookForEditing(book));
    
    // Create Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteBookItem(book._id, li));
    
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    bookList.appendChild(li);
}

// Load the book details into the form for editing
function loadBookForEditing(book) {
    bookTitle.value = book.title;
    bookAuthor.value = book.author;
    bookStatus.value = book.status;
    editingBookId = book._id; // Set the book ID for editing
}

// Delete a book (DELETE request)
async function deleteBookItem(bookId, bookElement) {
    try {
        await axios.delete(`${apiUrl}/${bookId}`);
        bookElement.remove(); // Remove from the UI
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

// Initial fetching of books when the page loads
window.addEventListener('DOMContentLoaded', fetchBooks);
