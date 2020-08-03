import React, { Component } from 'react';
import Loader from './Components/Loader/Loader.js';
import Table from './Components/Table/Table.js';
import DetailRowView from './Components/DetailRowView/DetailRowView.js';
import DataSelected from './Components/DataSelected/DataSelected.js'
import TableSearch from './Components/TableSearch/TableSearch.js'
import AddNewRow from './Components/AddNewRow/AddNewRow.js'
import ReactPaginate from 'react-paginate';
import _ from 'lodash';


class App extends Component {

  state = {
    isDataSelected: false,
    isLoading: false,
    isShowForm: false, 
    data: [],
    search: '',
    sortDirection: 'asc', // or desc
    sortField: 'id',
    selectionRow: null,
    currentPage: 0
  }

  async fetchData(url)  {
    const response = await fetch(url)
    const data = await response.json();

    this.setState({
      isLoading: false,
      data: _.orderBy(data, this.state.sortField, this.state.sortDirection)
    })
  }

  sortHandler = (field) => {
    const clonedData = this.state.data.concat();
    const sortType = this.state.sortDirection === 'asc' ? 'desc' : 'asc';

    const orderedData = _.orderBy(clonedData, field, sortType);

    this.setState({
      data: orderedData,
      sortDirection: sortType,
      sortField: field
    })

  }

  selectionHandler = (row) => {
    this.setState({
      selectionRow: row
    })
  }

  selectionData = (url) => {
    this.setState({
      isDataSelected: true,
      isLoading: true
    })

    this.fetchData(url)
  }

  pageChangeHandler = (page) => {
    this.setState({
      currentPage: page.selected
    })
  }

  searchHandler = (search) => {
    this.setState({
      search: search,
      currentPage: 0
    })
  }

  getFilteredData() {
    const {data, search} = this.state

    if (!search) {
      return data;
    }

    return data.filter(item => {
      return item['firstName'].toLowerCase().includes(search.toLowerCase())
        ||   item['lastName'].toLowerCase().includes(search.toLowerCase())
        ||   item['email'].toLowerCase().includes(search.toLowerCase())
        ||   item['phone'].toLowerCase().includes(search.toLowerCase());  
    })

  }

  showFormHandler = () => {
    this.setState({
      isShowForm: !this.state.isShowForm
    })
  }

  addNewRow = (event, values) => {
    event.preventDefault()

    const clonedData = this.state.data.concat();

    clonedData.unshift({
      id: values[0],
      firstName: values[1],
      lastName: values[2],
      email: values[3],
      phone: values[4],
    }) 

    this.setState({
      data: clonedData
    })

  }


  render() {
    if (!this.state.isDataSelected) {
      return (
        <div className="container">
          <DataSelected selectionData={this.selectionData}/>
        </div>
      )
    }

    const filteredData = this.getFilteredData()

    const pageSize = 50;
    const newData  = _.chunk(filteredData, pageSize),
      displayData = newData[this.state.currentPage],
      pageCount = newData.length;

    return (
      <div className="container">
        { 
          this.state.isLoading ? 
          <Loader /> :
          <React.Fragment>
            <TableSearch searchHandler={this.searchHandler}/>
            <AddNewRow 
              showFormHandler={this.showFormHandler}
              isShowForm={this.state.isShowForm}
              addNewRow={this.addNewRow}
            />
            <Table 
              data={displayData}
              sortHandler={this.sortHandler}
              sortDirection={this.state.sortDirection}
              sortField={this.state.sortField}
              selectionHandler={this.selectionHandler}
            />
          </React.Fragment>
        }
        {
          this.state.data.length > pageSize ?
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.pageChangeHandler}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousClassName='page-item'
            previousLinkClassName='page-link'
            nextClassName='page-item'
            nextLinkClassName='page-link'
            pageClassName='page-item'
            pageLinkClassName='page-link'
            forcePage={this.state.currentPage}
          /> : ''
        }
        {
          this.state.selectionRow ? 
          <DetailRowView person={this.state.selectionRow} /> :
          null
        }
      </div>
    );
  }
}

export default App;
