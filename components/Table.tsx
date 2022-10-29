import React from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const BookTable = ({ books, isLoading, type, method }) => {
    return (
        <>
            <Paper style={{ marginRight: "5px", height: 'min-content' }}>
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    component="div"
                >
                    {type === "borrow" ? 'Books in store' : 'My Books'}
                </Typography>
                <TableContainer component={Paper} style={{ width: '400px', backgroundColor: 'inherit', }}>
                    <Table sx={{ maxWidth: 390, maxHeight: 'auto', backgroundColor: 'rgba(255,255,255,0.8)' }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Book</TableCell>
                                <TableCell align="right">{type === 'borrow' ? 'Available Copies' : 'Borrowed copies'}</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book, index) => (
                                <TableRow
                                    key={type + index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {book.name}
                                    </TableCell>
                                    <TableCell align="right">{type === 'borrow' ? book.availableBooksInStore.toString() : book.copiesTaken.toString()}</TableCell>
                                    <TableCell align="right">
                                        {
                                            type === 'borrow' ?
                                                <Button
                                                    disabled={isLoading}
                                                    size="small"
                                                    variant="outlined"
                                                    style={{ marginRight: '5px' }}
                                                    onClick={() => method(book.id.toString())}
                                                >
                                                    Rent
                                                </Button> :
                                                <Button
                                                    disabled={isLoading}
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => method(book.id.toString())}
                                                >
                                                    Return
                                                </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
};

export default BookTable;