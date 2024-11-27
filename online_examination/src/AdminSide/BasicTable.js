import React, { useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, useRowSelect } from 'react-table';
import mData from './MOCK_DATA.json';
import { format } from 'date-fns';
import GlobalFilter from './GlobalFilter';
import { Checkbox } from './Checkbox';
import 'bootstrap/dist/css/bootstrap.min.css';

const BasicTable = ({ data, columns, deActiveMultipleUser, activeMultipleUser, deleteMultiUser,groups=null,filterByGroup=null }) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        state,
        setGlobalFilter,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        setPageSize,
        prepareRow,
        selectedFlatRows
    } = useTable(
        { columns, data },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <Checkbox {...getToggleAllRowsSelectedProps()} />
                    ),
                    Cell: ({ row }) => (
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                    )
                },
                ...columns
            ]);
        }
    );

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <div className="container">
            <div className='Contaniner mt-3'>
                <div className='row'>
                    <div className='col-sm-5'>
                        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} className="justify-content-start col-sm" />
                    </div>
                    {groups!=null && (
                    <div className='col-sm-3'>
                        <select
                            className="form-select"
                            id="groupid"
                            onChange={(e)=>filterByGroup(e.target.value)}
                        >
                            <option value="0">Select a group</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    )}
                    <div className='d-flex justify-content-end col-sm'>
                        <button className='btn btn-outline-danger mr-2' disabled={selectedFlatRows.length === 0} onClick={() => deleteMultiUser(selectedFlatRows)}>Delete</button>
                        <button className='btn btn-outline-success mr-2' disabled={selectedFlatRows.length === 0} onClick={() => activeMultipleUser(selectedFlatRows)}>activate</button>
                        <button className='btn btn-outline-secondary mr-2' disabled={selectedFlatRows.length === 0} onClick={() => deActiveMultipleUser(selectedFlatRows)}>Deactivat</button>
                    </div>
                </div>
            </div>
            <table {...getTableProps()} className="table table-striped table-bordered mt-3">
                <thead className="thead-dark">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className="text-center"
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="text-center">
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <input
                        type="number"
                        className="form-control d-inline-block"
                        style={{ width: '80px' }}
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber);
                        }}
                    />
                </div>
                <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="form-select w-auto"
                >
                    {[10, 25, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <div>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        Next
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => gotoPage(pageOptions.length - 1)}
                        disabled={!canNextPage}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
            {/* for checking selected rows */}
            {/* <div>
                <h4>Selected Rows:</h4>
                <pre>{JSON.stringify(selectedFlatRows.map((d) => d.original), null, 2)}</pre>
            </div> */}
        </div>
    );
};

export default BasicTable;
