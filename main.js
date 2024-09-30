document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  const searchBook = document.getElementById("searchBook");

  let books = [];

  // Memuat buku dari localStorage jika ada
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }

  // Menyimpan buku ke localStorage
  function saveBooksToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Menambahkan buku baru melalui form
  inputBook.addEventListener("submit", function (e) {
    e.preventDefault();

    const bookFormTitle = document.getElementById("bookFormTitle").value;
    const bookFormAuthor = document.getElementById("bookFormAuthor").value;
    const bookFormYear = Number(document.getElementById("bookFormYear").value);
    const bookFormIsComplete = document.getElementById("bookFormIsComplete").checked;

    // Cek apakah buku sudah ada
    const isDuplicate = books.some((book) => book.title === bookFormTitle);

    if (isDuplicate) {
      alert("Buku dengan judul yang sama sudah ada dalam daftar.");
    } else {
      const book = {
        id: new Date().getTime(),
        title: bookFormTitle,
        author: bookFormAuthor,
        year: bookFormYear,
        isComplete: bookFormIsComplete,
      };

      books.push(book);
      saveBooksToLocalStorage();
      updateBookshelf();

      // Reset form
      document.getElementById("bookFormTitle").value = "";
      document.getElementById("bookFormAuthor").value = "";
      document.getElementById("bookFormYear").value = "";
      document.getElementById("bookFormIsComplete").checked = false;
    }
  });

  // Memperbarui rak buku
  function updateBookshelf() {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of books) {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  }

  // Menghapus buku berdasarkan ID
  function removeBook(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      saveBooksToLocalStorage();
      updateBookshelf();
    }
  }

  // Memindahkan buku antara rak
  function toggleIsComplete(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      saveBooksToLocalStorage();
      updateBookshelf();
    }
  }

  // Fungsi pencarian buku
  searchBook.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("searchBookTitle").value.toLowerCase().trim();

    const searchResults = books.filter((book) => {
      return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query) || book.year.toString().includes(query);
    });

    updateSearchResults(searchResults);
  });

  // Memperbarui hasil pencarian
  function updateSearchResults(results) {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of results) {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  }

  function createBookItem(book) {
    const bookItem = document.createElement("article");
    bookItem.className = "book_item";
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.setAttribute("data-bookid", book.id);

    const title = document.createElement("h3");
    title.textContent = book.title;
    title.setAttribute("data-testid", "bookItemTitle");

    const author = document.createElement("p");
    author.textContent = "Penulis: " + book.author;
    author.setAttribute("data-testid", "bookItemAuthor");

    // Inisialisasi variabel year sebelum digunakan
    const year = document.createElement("p");
    year.textContent = "Tahun: " + book.year;
    year.setAttribute("data-testid", "bookItemYear");

    const removeButton = createActionButton("Hapus buku", "red", function () {
      removeBook(book.id);
    });
    removeButton.setAttribute("data-testid", "bookItemDeleteButton");

    let toggleButton;
    if (book.isComplete) {
      toggleButton = createActionButton("Belum selesai dibaca", "green", function () {
        toggleIsComplete(book.id);
      });
      toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    } else {
      toggleButton = createActionButton("Selesai dibaca", "blue", function () {
        toggleIsComplete(book.id);
      });
    }
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");

    const actionButtons = document.createElement("div");
    actionButtons.className = "action";
    actionButtons.appendChild(toggleButton);
    actionButtons.appendChild(removeButton);

    // Tambahkan elemen-elemen ke bookItem
    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(year); // Pastikan year sudah diinisialisasi di atas
    bookItem.appendChild(actionButtons);

    return bookItem;
  }

  // Membuat tombol aksi
  function createActionButton(text, className, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    return button;
  }

  // Inisialisasi rak buku
  updateBookshelf();
});
