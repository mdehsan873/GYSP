export const options1 = {
    pagination: true,
    toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        print: false,
        viewColumns: "View Columns",
        filterTable: "Filter Table",
    }
    ,
    selectedRows: {
        text: "row(s) selected n",
        delete: "Archive",
        deleteAria: "Archieve Selected Rows",
    },
    onRowsDelete: e => console.log(e.data),
    print: true,
    elevation: 0,
    viewColumns: false,

};
export const options2 = {
    filterType: 'none',
    toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        viewColumns: "View Columns",
        filterTable: "Filter Table",
    },
    elevation: 0,
    viewColumns: false,
    selectableRows: 'none'
};
export const outcomeTableOptions = {
    toolbar: false,
    download: false,
    search: false,
    print: false,
    filter: false,
    pagination: false,
    elevation: 0,
    viewColumns: false,
    selectableRows: 'none'
};
export const space = {
    padding: 2, margin: 2
}
export const subjectArr = ['Maths', 'Science', 'Social Science', 'English']