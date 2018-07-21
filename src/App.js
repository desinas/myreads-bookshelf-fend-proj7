import React, { Component } from 'react'
import {Route, Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListOfBooks from './ListOfBooks'
import Book from "./Book"
/**
* TODO: Instead of using this state variable to keep track of which page
* we're on, use the URL in the browser's address bar. This will ensure that
* users can use the browser's back and forward buttons to navigate between
* pages, as well as provide a good URL they can bookmark and share.
*/
class BooksApp extends Component {
  state = {
    books: [],
    query: '',
    showingBooks: []
  }

  updateShelf = (book, shelf) => {
    let books;
    if (this.state.books.findIndex(b => b.id === book.id) > 0) {
      // change the position of an existing book in the shelf
      books = this.state.books.map(b => {
        if (b.id === book.id) {
          return {...book, shelf}
        } else {
          return b
        }
      })
    } else {
      // add a new book to the shelf
      books = [...this.state.books, {...book, shelf}]
    }

    this.setState({books})

    BooksAPI.update(book, shelf).then((data) => {
      // shelf updated on the server
    })
  }
  /**
  * Component lifecycle event method is used to hook the get-all-books method
  * immediately after the component is inserted into the DOM and rendered
  */
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({books})
    })
  }
  /** Managing input state by checking if there is a query,
  * using Books API search method that returns a promise response with then
  * and change the showing books to the user
  */
  updateQuery = (query) => {
    this.setState({query: query})
    let showingBooks = []
    if (query) {
      BooksAPI.search(query).then(response => {
        if (response.length) {
          showingBooks = response.map(b => {
            const index = this.state.books.findIndex(c => c.id === b.id)
            if( index >= 0 ) {
              return this.state.books[index]
            } else {
              return b
            }
          })
        }
        this.setState({showingBooks})
      })
    }
    else {
      this.setState({showingBooks})
    }
  }

  render() {
    const {query} = this.state
    return ( <div className="app">

        <Route exact path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text"
                       placeholder="Search by title or author"
                       value={query}
                       onChange={(event) => this.updateQuery(event.target.value)}
                />

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.showingBooks.map((book, i) => (
                  <Book key={i} book={book}
                        onUpdateBook={(book, shelf) => this.updateShelf(book, shelf)}/>
                ))}
              </ol>
            </div>
          </div>
        )} />
        <Route exact path="/" render={() => (
          <ListOfBooks books={this.state.books}
                     onUpdateShelf={(book, shelf) => this.updateShelf(book, shelf)}/>
        )}/>

    </div> )
  }
}

export default BooksApp
