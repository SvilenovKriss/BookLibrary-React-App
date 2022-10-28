import BOOK_LIBRARY_ABI from "../contracts/BookLibrary.json";
import useContract from "./useContract";

export default function useBookLibraryContract(contractAddress?: string) {
  return useContract(contractAddress, BOOK_LIBRARY_ABI);
}
