import { DndContext, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button } from '@mui/material';
import { flexRender } from '@tanstack/react-table';

function DraggableRow({ row }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };
  return (
    <tr key={row.id} ref={setNodeRef} style={style} className="relative">
      {row.getVisibleCells().map((cellEl) => {
        return (
          <td
            key={cellEl.id}
            className="text-left border h-auto bg-white"
            style={{
              width: `calc(var(--col-${cellEl.column.id}-size) * 1px)`,
              wordBreak: 'break-word',
              verticalAlign: 'top',
              // whiteSpace: 'nowrap',
              ...getCommonPinningStyles(cellEl.column),
            }}
          >
            {flexRender(cellEl.column.columnDef.cell, cellEl.getContext())}
          </td>
        );
      })}
    </tr>
  );
}

// function PositionedMenu() {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <Tooltip title="Show/Hide Columns">
//         <button
//           type="submit"
//           onClick={handleClick}
//           id="demo-positioned-button"
//           aria-controls={open ? 'demo-positioned-menu' : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? 'true' : undefined}
//           className="hover:bg-[#f7f7f8] focus:bg-[#f7f7f8] rounded-full bg-transparent p-8 flex items-center justify-center"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="w-20 h-20"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
//             />
//           </svg>
//         </button>
//       </Tooltip>

//       <Menu
//         id="demo-positioned-menu"
//         aria-labelledby="demo-positioned-button"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'left',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'left',
//         }}
//       >
//         <div>
//           <div className="flex gap-16 py-16 px-8">
//             <button type="submit" className="font-bold text-md">
//               Hide all
//             </button>
//             <button type="submit" className="font-bold text-md">
//               Reset order
//             </button>
//             <button type="submit" className="font-bold text-md">
//               Unpin all
//             </button>
//             <button type="submit" className="font-bold text-md">
//               Show all
//             </button>
//           </div>
//           <div className="border-t flex items-center">
//             <FormGroup className="flex justify-center space-y-24 py-12 pl-12 mx-auto">
//               <FormControlLabel
//                 control={<Switch defaultChecked />}
//                 label="Bold"
//               />
//               <FormControlLabel
//                 control={<Switch defaultChecked />}
//                 label="Service"
//               />
//               <FormControlLabel
//                 control={<Switch defaultChecked />}
//                 label="Description"
//               />
//               <FormControlLabel
//                 control={<Switch defaultChecked />}
//                 label="Range"
//               />
//               <FormControlLabel
//                 control={<Switch defaultChecked />}
//                 label="Standard"
//               />
//               <FormControlLabel
//                 control={<Switch defaultChecked />}
//                 label="Quantity"
//               />
//               <FormControlLabel
//                 control={<Switch defaultChecked />}
//                 label="Total"
//               />
//             </FormGroup>
//           </div>
//         </div>
//       </Menu>
//     </div>
//   );
// }

const getCommonPinningStyles = (column) => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    // eslint-disable-next-line no-nested-ternary
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
      ? '4px 0 4px -4px gray inset'
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export default function QuoteItemTable({ tableArgs }) {
  const { table, sensors, handleDragEnd, filtering, setFiltering, dataIds } =
    tableArgs;
  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="flex flex-col">
        <div
          className=" relative"
          style={{
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <div className="w-full flex py-8 px-12 justify-end  items-center">
            <div className="mr-64 space-x-12 flex items-center">
              <div
                className="flex items-center px-8 py-4 gap-8 rounded-md hover:!border-black focus:!border-black"
                style={{
                  border: '1px solid #e9e9e9',
                }}
              >
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  className="h-full"
                  placeholder="Search"
                  type="text"
                  value={filtering}
                  onChange={(e) => setFiltering(e.target.value)}
                />
                <button type="submit" onClick={() => setFiltering('')}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#bfbfbf"
                    className="w-24 h-24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div>{/* <PositionedMenu /> */}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-16">
          <div className="min-h-32 overflow-x-auto flex-1">
            <table
              className="border-collapse border bg-white relative overflow-x-scroll overflow-y-hidden"
              {...{
                style: {
                  width: table.getTotalSize(),
                  tableLayout: 'fixed',
                },
              }}
            >
              <thead>
                {table.getHeaderGroups().map((headerEl) => {
                  return (
                    <tr key={headerEl.id} className="relative">
                      {headerEl.headers.map((columnEl) => {
                        return (
                          <th
                            key={columnEl.id}
                            className="text-left border py-8 px-14 bg-white"
                            colSpan={columnEl.colSpan}
                            style={{
                              width: `${columnEl.getSize()}px`,
                              ...getCommonPinningStyles(columnEl.column),
                            }}
                          >
                            {flexRender(
                              columnEl.column.columnDef.header,
                              columnEl.getContext()
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody>
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((rowEl) => (
                    <DraggableRow key={rowEl.id} row={rowEl} />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Button
        className="mt-16"
        variant="contained"
        color="secondary"
        size="medium"
        onClick={table.options.meta?.addEmptyRow}
      >
        <FuseSvgIcon size={24}>heroicons-outline:plus</FuseSvgIcon>
        <span className="mx-4 sm:mx-8">Add New Row</span>
      </Button>
    </DndContext>
  );
}
