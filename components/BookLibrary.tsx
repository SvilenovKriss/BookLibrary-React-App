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
import type { BookLibraryType } from "../types/BookLibrary.type";

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

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const booksLength: number = await bookLibraryContract.getBooksLength();
    const bookArr = [];

    for (let i = 0; i < booksLength; i++) {
      const [id, name, availableBooksInStore] = await bookLibraryContract.books(i);
      bookArr.push({ id, name, availableBooksInStore });
    }

    console.log(bookArr);

    setBooks(bookArr);
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

  return (
    <Box>
      {isLoading ? <CircularProgress style={{ position: 'absolute', top: '330px' }} /> : ''}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          id="add-book"
          sx={{ minWidth: 400, width: 800, background: 'inherit' }}
          style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center' }}
        >
          <Typography sx={{ fontSize: 20, display: 'flex', justifyContent: 'center', flexDirection: 'column' }} color="text.secondary" gutterBottom>
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <Button disabled={isLoading} variant="contained" onClick={addBook}>Add</Button>
          </div>
        </Card>
      </div>
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer component={Paper} style={{ width: '800px', backgroundColor: 'inherit', }}>
          <Table sx={{ minWidth: 650, backgroundColor: 'rgba(255,255,255,0.8)' }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell align="right">Left Copies</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow
                  key={book.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {book.name}
                  </TableCell>
                  <TableCell align="right">{book.availableBooksInStore.toString()}</TableCell>
                  <TableCell align="right">
                    <Button
                      disabled={isLoading}
                      size="small"
                      variant="outlined"
                      style={{ marginRight: '5px' }}
                      onClick={() => rentBook(book.id.toString())}
                    >
                      Rent
                    </Button>
                    <Button disabled={isLoading} size="small" variant="outlined">Return</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default BookLibrary;
