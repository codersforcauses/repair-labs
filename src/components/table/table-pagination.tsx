interface TablePaginationProps {
  page: number;
  perPage: number;
  totalCount: number;
  nextPage: () => unknown;
  prevPage: () => unknown;
}

const TablePagination = ({
  page,
  perPage,
  totalCount,
  nextPage,
  prevPage
}: TablePaginationProps) => {
  return (
    <div className="mt-2 flex flex-row justify-between">
      <div className="flex flex-row items-center gap-1 text-sm text-gray-700">
        Showing
        <span className="font-semibold text-gray-900">
          {perPage * page - perPage == 0 ? 1 : perPage * page - perPage}
        </span>
        <span>to</span>
        <span className="font-semibold text-gray-900">
          {totalCount >= perPage * page ? perPage * page : totalCount}
        </span>
        of
        <span className="font-semibold text-gray-900">{totalCount}</span>
        Entries
      </div>

      <div className="inline-flex ">
        <button
          className="flex h-8 items-center justify-center rounded-l bg-primary-400 px-3 text-sm font-medium text-white hover:bg-gray-900"
          onClick={() => prevPage()}
        >
          Prev
        </button>
        <button
          className="flex h-8 items-center justify-center rounded-r border-0 border-l border-white bg-primary-400 px-3 text-sm font-medium text-white hover:bg-gray-900 "
          onClick={() => nextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
