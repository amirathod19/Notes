import React, { useEffect, useState } from "react";

const AddNote = () => {
  const [notes, setNotes] = useState({});
  const [showData, setShowData] = useState([]);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(0);

  const getApiData = async () => {
    const url = "http://localhost:3000/notes";
    const response = await fetch(url);
    const notesData = await response.json();
    setShowData(notesData);
  };

  useEffect(() => {
    getApiData();
  }, []);

  const getData = (e) => {
    // console.log(e.target.name,e.target.value,"getdata")
    setNotes((prev) => {
      // console.log(prev,"prev getdata")
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  var nDate = new Date();

  const addnotes = async () => {
    // console.log(nDate)
    const postData = {
      title: notes.notetitle,
      description: notes.notedetail,
      createdDate: nDate,
    };
    // console.log(postData);
    const url = "http://localhost:3000/notes";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const createData = await res.json();
    // console.log(createData, "craeteData");
    setShowData((prev) => [...prev, createData]);
    // getApiData()
    // setShowData((prev) => [...prev, { ...notes, nDate }]);
    setNotes({ notetitle: "", notedetail: "" });
  };
  // console.log(notes,"notes")

  const deletenotes = async(index) => {
    const url = `http://localhost:3000/notes/${index}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const delData = await res.json()
    console.log(delData)
    const delNotes = showData.filter((item, i) => item.id !== index);
    setShowData(delNotes);
  };

  const editButtonHandler = (data, i) => {
    // console.log(data, "editbutton handler");
    setIsUpdateVisible(true);
    setNotes({
      id: data.id,
      notetitle: data.title,
      notedetail: data.description,
    });
    setUpdateIndex(i);
  };

  const updataNotes = async () => {
    // console.log(updateIndex,"updateindex")
    const url = `http://localhost:3000/notes/${updateIndex}`;
    const updateNotesData = {
      id: notes.id,
      title: notes.notetitle,
      description: notes.notedetail,
      createdDate: nDate,
    };
    const editdata = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(updateNotesData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const res = await editdata.json();

    const arrayIndex = showData.findIndex((i) => i.id === notes.id);
    // console.log(arrayIndex, "index");
    if (arrayIndex != -1){
      setShowData((prev) => {
        let prevData = prev;
        prevData[arrayIndex] = { ...prevData[arrayIndex], ...res };
        return prevData;
      });
    }
    setNotes({ notetitle: "", notedetail: "" });
    setIsUpdateVisible(false);
  };
  return (
    <>
      <input
        type="text"
        name="notetitle"
        placeholder="Add Title..."
        value={notes?.notetitle || ""}
        onChange={getData}
      />
      <br />
      <textarea
        name="notedetail"
        id=""
        cols="30"
        rows="10"
        placeholder="Add Notes"
        value={notes?.notedetail || ""}
        onChange={getData}
      ></textarea>
      <br />
      {isUpdateVisible ? (
        <button onClick={updataNotes}>Update</button>
      ) : (
        <button onClick={addnotes}>Add</button>
      )}

      {showData.map((item, i, arr) => {
        console.log(item, "showdata item");
        return (
          <div key={i}>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            {/* <p>created at: {item.createdDate.toISOString()} </p> */}
            <p>created at: {item.createdDate?.toLocaleString()} </p>
            <button onClick={() => deletenotes(item.id)}>delete</button>
            <button onClick={() => editButtonHandler(item, item.id)}>
              Edit
            </button>
          </div>
        );
      })}
    </>
  );
};

export default AddNote;
