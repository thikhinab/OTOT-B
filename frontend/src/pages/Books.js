import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

const URL = process.env.REACT_APP_BOOKS_BASE_URL;

const Books = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    add: false,
    delete: false,
    update: false,
    isbn13: "",
    author: "",
    title: "",
  });

  console.log(form);

  const getBooks = async () => {
    try {
      const result = await axios.get(URL);
      if (result.data.status === "success") {
        setBooks(result.data.data);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const toggleForm = (e) => {
    const value = e.target.value === "true";
    setForm((prevState) => {
      const newState = { ...prevState };
      newState.add = false;
      newState.delete = false;
      newState.update = false;
      newState[e.target.id] = !value;
      newState.isbn13 = "";
      newState.title = "";
      newState.author = "";
      console.log("newState", newState);
      return newState;
    });
  };

  const updateInput = (e) => {
    setForm((prevState) => {
      const newState = { ...prevState };
      newState[e.target.id] = e.target.value;
      return newState;
    });
  };

  const addBook = () => {
    axios
      .post(URL, {
        isbn13: form.isbn13,
        author: form.author,
        title: form.title,
      })
      .then((result) => handleResult(result))
      .catch((e) => handleError(e.response));
  };

  const updateBook = () => {
    axios
      .put(`${URL}/${form.isbn13}`, {
        author: form.author,
        title: form.title,
      })
      .then((result) => handleResult(result))
      .catch((e) => handleError(e.response));
  };

  const deleteBook = () => {
    axios
      .delete(`${URL}/${form.isbn13}`)
      .then((result) => handleResult(result))
      .catch((e) => handleError(e.response));
  };

  const handleError = (response) => {
    if (response.data.message) {
      alert(response.data.message);
    }
  };

  const handleResult = async (result) => {
    if (result.data.status === "success") {
      await getBooks();
    }
  };

  const notEmpty = () => {
    return (
      form.isbn13.length > 0 && form.author.length > 0 && form.title.length > 0
    );
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (form.add && notEmpty()) {
      addBook();
    } else if (form.update && notEmpty()) {
      updateBook();
    } else if (form.delete && form.isbn13.length > 0) {
      deleteBook();
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <Container style={{ padding: 20 }}>
      {books.length === 0 ? (
        <h3>No books in database</h3>
      ) : (
        <Table striped bordered hover style={{ padding: 20 }}>
          <thead>
            <tr>
              <th>ISBN13</th>
              <th>Title</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => {
              return (
                <tr key={book._id}>
                  <td>{book.isbn13}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Container style={{ maxWidth: "50vw" }}>
        <ButtonGroup>
          <ToggleButton
            id="add"
            type="checkbox"
            variant={"outline-success"}
            checked={form.add}
            value={form.add}
            onChange={(e) => toggleForm(e)}
          >
            Add Book
          </ToggleButton>
          <ToggleButton
            id="update"
            type="checkbox"
            variant={"outline-primary"}
            checked={form.update}
            value={form.update}
            onChange={(e) => toggleForm(e)}
          >
            Update Book
          </ToggleButton>
          <ToggleButton
            id="delete"
            type="checkbox"
            variant={"outline-danger"}
            checked={form.delete}
            value={form.delete}
            onChange={(e) => toggleForm(e)}
          >
            Delete Book
          </ToggleButton>
        </ButtonGroup>
      </Container>
      {(form.add || form.delete || form.update) && (
        <Container style={{ maxWidth: "50vw", padding: 20 }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ISBN13</Form.Label>
              <Form.Control
                id="isbn13"
                type="text"
                placeholder="Enter ISBN13"
                value={form.isbn13}
                onChange={(e) => updateInput(e)}
              />
            </Form.Group>
            {!form.delete && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    id="title"
                    type="text"
                    placeholder="Enter Book's Title"
                    value={form.title}
                    onChange={(e) => updateInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    id="author"
                    type="text"
                    placeholder="Enter Book's Author"
                    value={form.author}
                    onChange={(e) => updateInput(e)}
                  />
                </Form.Group>
              </>
            )}
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => submitForm(e)}
            >
              Submit
            </Button>
          </Form>
        </Container>
      )}
    </Container>
  );
};

export default Books;
