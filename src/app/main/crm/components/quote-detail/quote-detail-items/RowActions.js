import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';

/* eslint-disable jsx-a11y/control-has-associated-label */
export default function RowActions({ row, addHandler, deleteHandler }) {
  const dispatch = useDispatch();
  const handleAdd = () => {
    if (row.original.createdAt || row.original.updatedAt) {
      return; // Do nothing if createdAt or updatedAt exists
    }

    if (!row._valuesCache.service) {
      dispatch(
        showMessage({
          message: 'Service must be specified',
          variant: 'error',
        })
      );
      return;
    }

    addHandler(row._valuesCache);
  };

  return (
    <div className="flex gap-8  items-center justify-center w-full h-full">
      <button
        type="submit"
        className={`${
          row.original.createdAt || row.original.updatedAt
            ? 'hover:bg-[#f7f7f8]'
            : 'hover:bg-[#dff2d8]'
        } rounded-full p-8`}
        onClick={() => handleAdd()}
      >
        {row.original.createdAt || row.original.updatedAt ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-20 h-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="green"
            className="w-20 h-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        )}
      </button>

      <button
        type="submit"
        className="hover:bg-[#f3e1d4] rounded-full p-8"
        onClick={() => deleteHandler(row)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="red"
          className="w-20 h-20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}
