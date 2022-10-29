import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import toastr from 'toastr';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import useBookLibraryContract from "../hooks/useBookLibraryContract";
import BookTable from "./Table";

type BookLibraryContract = {
  contractAddress: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP
}

const BookLibrary = ({ contractAddress }: BookLibraryContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const bookLibraryContract = useBookLibraryContract(contractAddress);
  const [name, setName] = useState('');
  const [copies, setCopies] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    const call = async () => {
      await fetchBooks();
    }

    call();

  }, []);

  useEffect(() => {
    const call = async () => {
      await getUserBooks();
    }

    call();
  }, [books]);

  const fetchBooks = async () => {
    const booksLength: number = await bookLibraryContract.getBooksLength();
    const bookArr = [];

    for (let i = 0; i < booksLength; i++) {
      try {
        const [id, name, availableBooksInStore] = await bookLibraryContract.books(i);
        bookArr.push({ id, name, availableBooksInStore });
      } catch (err) {
        toastr.error(err.message);
      }
    }

    setBooks(bookArr);
  }

  const getUserBooks = async () => {
    const userBooksCount = (await bookLibraryContract.getUserBooks()).toString();
    const userBooks = [];

    for (let i = 0; i < userBooksCount; i++) {
      try {
        const [id, copiesTaken] = await bookLibraryContract.userBook(account, i);
        const name = books.find((book) => book.id.toString() === id.toString()).name;

        if (name && copiesTaken > 0) {
          userBooks.push({ id: id.toString(), copiesTaken: copiesTaken.toString(), name });
        }
      } catch (err) {
        console.log(err.message);
      }
    }

    setUserBooks(userBooks);
  }

  const addBook = async () => {
    if (name.length >= 1 && copies > 0) {
      try {
        const addBookTx = await bookLibraryContract.addBook(name, copies);
        setLoading(true);

        await addBookTx.wait();

        setLoading(false);
        setName('');
        setCopies(0);
        fetchBooks();

        toastr.success('Book added!');
      } catch (err) {
        toastr.error(err.message)
      }
    } else {
      toastr.warning('You need to fill name and copies!')
    }
  }

  const rentBook = async (id) => {
    if (id && books[id].availableBooksInStore > 0) {
      try {
        const txRentBook = await bookLibraryContract.borrowBook(id);
        setLoading(true);

        await txRentBook.wait();

        fetchBooks();
        setLoading(false);
      } catch (err) {
        toastr.error(err.message);
      }
    } else {
      toastr.error('There are no available books currently.')
    }
  }

  const returnBook = async (id) => {
    const userBookIndex = userBooks.findIndex((book) => book.id === id && book.copiesTaken > 0);
    if (userBookIndex >= 0) {
      try {
        const returnBookTx = await bookLibraryContract.returnBook(userBookIndex);
        setLoading(true);

        await returnBookTx.wait();

        setLoading(false);
        fetchBooks();
      } catch (err) {
        toastr.error(err.message);
      }
    } else {
      toastr.error('You need to rent it first!')
    }
  }

  return (
    <Box>
      {isLoading ? <CircularProgress style={{ position: 'absolute', top: '330px' }} /> : ''}
      <div className="d-flex-center">
        <Card
          id="add-book"
          sx={{ minWidth: 400, width: 800, background: 'inherit' }}
          style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center' }}
        >
          <Typography className="d-flex-center" sx={{ fontSize: 20, flexDirection: 'column' }} color="text.secondary" gutterBottom>
            Add Book
          </Typography>
          <TextField
            id="book-name"
            label="Book Name"
            name="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            variant="outlined"
            style={{ margin: '10px' }}
          />
          <TextField
            id="book-copies"
            label="Copies"
            type="number"
            variant="outlined"
            name="copies"
            value={copies}
            onChange={(e: any) => setCopies(e.target.value)}
            style={{ margin: '10px' }}
          />
          <div className="d-flex-center" style={{
            flexDirection: 'column',
          }}>
            <Button disabled={isLoading} variant="contained" onClick={addBook}>Add</Button>
          </div>
        </Card>
      </div>
      <br />
      <div className="d-flex-center">
        <BookTable books={books} isLoading={isLoading} type="borrow" method={rentBook} />
        <BookTable books={userBooks} isLoading={isLoading} type="return" method={returnBook} />
      </div>
    </Box>
  );
};

export default BookLibrary;
