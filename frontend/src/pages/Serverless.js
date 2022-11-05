import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useEffect, useState } from "react";
import axios from "axios";

const VENUE_URL = process.env.REACT_APP_SERVERLESS_VENUE_URL;
const CLASSES_URL = process.env.REACT_APP_SERVERLESS_CLASSES_URL;

const Serverless = () => {
  const [classes, setClasses] = useState([]);
  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState({
    fetched: false,
    day: "",
    venue: "",
  });

  const getVenue = async () => {
    try {
      const result = await axios.get(VENUE_URL);
      setVenues(result.data.data);
    } catch (e) {
      alert(e.message);
    }
  };

  const getClasses = async () => {
    try {
      const result = await axios.get(CLASSES_URL, {
        params: {
          day: form.day,
          venue: form.venue,
        },
      });
      setClasses(result.data.data);
      setForm((prevState) => {
        return { ...prevState, fetched: true };
      });
    } catch (e) {
      if (e.response.data.error) {
        setForm((prevState) => {
          return { ...prevState, fetched: true };
        });
        alert(e.response.data.error);
      } else {
        alert(e.message);
      }
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (form.day === "" || form.venue === "") {
      alert("Please select both day and venue");
    }
    getClasses();
  };

  const changeForm = (e) => {
    setForm((prevState) => {
      const newState = { ...prevState };
      newState[e.target.id] = e.target.value;
      return newState;
    });
  };

  useEffect(() => {
    getVenue();
  }, []);

  return (
    <Container style={{ padding: 20 }}>
      {!form.fetched && <h3>Select a venue and day to look up classes</h3>}
      {form.fetched && classes.length === 0 && (
        <h3>No classes on fetched day and venue</h3>
      )}
      {form.fetched && classes.length > 0 && (
        <Table striped bordered hover style={{ padding: 20 }}>
          <thead>
            <tr>
              <th>Module code</th>
              <th>Lesson Type</th>
              <th>Start time</th>
              <th>End time</th>
              <th>Class Number</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c, i) => {
              return (
                <tr key={i}>
                  <td>{c.moduleCode}</td>
                  <td>{c.lessonType}</td>
                  <td>{c.startTime}</td>
                  <td>{c.endTime}</td>
                  <td>{c.classNo}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Container style={{ maxWidth: "50vw", padding: 20 }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Select
              id="venue"
              value={form.venue}
              onChange={(e) => changeForm(e)}
            >
              <option value={""} disabled>
                Select and a venue
              </option>
              {venues.map((venue) => (
                <option key={venue} value={venue}>
                  {venue}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Day</Form.Label>
            <Form.Select
              id="day"
              value={form.day}
              onChange={(e) => changeForm(e)}
            >
              <option value={""} disabled>
                Select a day
              </option>
              <option value={"monday"}>Monday</option>
              <option value={"tuesday"}>Tuesday</option>
              <option value={"wednesday"}>Wednesday</option>
              <option value={"thursday"}>Thursday</option>
              <option value={"friday"}>Friday</option>
            </Form.Select>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={(e) => submitForm(e)}
          >
            Submit
          </Button>
        </Form>
      </Container>
    </Container>
  );
};

export default Serverless;
