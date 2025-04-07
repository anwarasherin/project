function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-black">
        <thead className="bg-gray-50 text-grayText">
          <tr>
            {headers.map((header) => {
              return (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-border">
          {rows.map((row) => row)}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
