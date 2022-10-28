type UserBook = {
    id: string;
    copiesTaken: number;
}

type Book = {
    id: number;
    name: string;
    availableBooksInStore: number;
}

export type BookLibraryType = {
    getBooksLength: (index: number) => number;
    returnBook: (index: number) => void;
    borrowBook: (id: number) => void;
    addBook: (name: string, copies: number) => void;
    userBook: (address: string, index: number) => UserBook;
    books: (index: number) => Book;
}