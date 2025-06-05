import { useDispatch, useSelector } from 'react-redux';

// Типизированные хуки для Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;