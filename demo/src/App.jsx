import React, { Component } from 'react'
import Timeline from 'react-timelines'
import Popup from "reactjs-popup";
import Datetime from "react-datetime";

import 'react-timelines/lib/css/style.css'

import {
  START_YEAR,
  NUM_OF_YEARS,
  NUM_OF_TRACKS,
} from './constants'

import {
  buildTimebar,
} from './builders'


const now = new Date('2021-01-01')

const timebar = buildTimebar()

// eslint-disable-next-line no-alert
const clickElement = element => (
    this.openModal(element)
);

const MIN_ZOOM = 10
const MAX_ZOOM = 30

class App extends Component {
  constructor(props) {
    super(props)

     this.state = {
         open: false,
         zoom: 10,
         tracks: Object.values([]),
         title: "",
         openPopup: false,
         element : ""
     }


      this.openModal = this.openModal.bind(this)
      this.closeModal = this.closeModal.bind(this)
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8082/timelines/boulanger")
      .then(res => res.json())
      .then(
        (result) => {
          var timelines = result.timelines;
          timelines.forEach(timeline => {
            timeline.elements.forEach( element => {
              element.start = new Date(element.start);
              element.end = new Date(element.end);
            })
          });

          this.setState({
            open: false,
            zoom: 10,
            tracks: Object.values(timelines),
            title: result.title
          })
        }
        ,
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("error occured when fetching timelines");
        }
      )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  handleZoomIn = () => {
    this.setState({
      zoom: Math.min(this.state.zoom + 1, MAX_ZOOM),
    })
  }

  handleZoomOut = () => {
    this.setState({
      zoom: Math.max(this.state.zoom - 1, MIN_ZOOM),
    })
  }

  handleToggleTrackOpen = (track) => {
    const tracksById = {
      ...this.state.tracksById,
      [track.id]: {
        ...track,
        isOpen: !track.isOpen,
      },
    }

    this.setState({
      tracksById,
      tracks: Object.values(tracksById),
    })
  }

    openModal (elementToDisplay){
        this.setState({
            element: elementToDisplay,
            openPopup: true })
    }
    closeModal () {
        this.setState({ openPopup: false })
    }


    handleSubmit(event) {
        fetch('http://localhost:8082/timelines/boulanger', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.element)
        }).then(
                (success) => {
                    console.log("success ");
                },
                (error) => {
                    console.log("error ");
                }
            )
    }

    handleChange(event) {

        let elementChanged = Object.assign({}, this.state.element);

        if(event.target.name == 'id'){
            elementChanged.id = event.target.value;
        }

        if(event.target.name == 'title'){
            elementChanged.title = event.target.value;
        }

        if(event.target.name == 'start'){
            elementChanged.start = event.target.value;
        }

        if(event.target.name == 'end'){
            elementChanged.end = event.target.value;
        }

        if(event.target.name == 'classes'){
            elementChanged.classes = [].push(event.target.value);
        }

        this.setState({element : elementChanged});
    }

  render() {
    const { open, zoom, tracks, title } = this.state
    const start = new Date(`${START_YEAR}`)
    const end = new Date(`${START_YEAR + NUM_OF_YEARS}`)
    return (
      <div className="app">
        <h1 className="title">{title}</h1>
        <Timeline
          scale={{
            start,
            end,
            zoom,
            zoomMin: MIN_ZOOM,
            zoomMax: MAX_ZOOM,
          }}
          isOpen={open}
          zoomIn={this.handleZoomIn}
          zoomOut={this.handleZoomOut}
          clickElement={element => (
              this.openModal(element)
          )}
          clickTrackButton={(track) => { alert(JSON.stringify(track)); console.log(JSON.stringify(track)) }}
          timebar={timebar}
          tracks={tracks}
          now={now}
          enableSticky
          scrollToNow
        />

          <Popup
              open={this.state.openPopup}
              closeOnDocumentClick
              onClose={this.closeModal}
          >
              <div className="modal">
                  <a className="close" onClick={this.closeModal}>
                      &times;
                  </a>
                  <form onSubmit={this.handleSubmit}>
                      <div className="header">
                          {this.state.element.title}
                      </div>
                      <div className="content">
                          <div>
                            <label htmlFor="id_task">id:</label>
                            <input type="text" name="id" id="id_task" value={this.state.element.id} onChange={this.handleChange} />
                          </div>

                          <div>
                              <label htmlFor="title_task"> Title: </label>
                              <input type="text" name="title" id="title_task" value={this.state.element.title} onChange={this.handleChange} />
                          </div>

                          <div>
                              <label htmlFor="start_task">start:</label>
                              <Datetime name="start" id="start_task" value={this.state.element.start} onChange={this.handleChange}/>
                          </div>

                          <div>
                            <label htmlFor="end_task"> end: </label>
                              <Datetime  name="end" id="end_task" value={this.state.element.end} onChange={this.handleChange}/>
                          </div>

                          <div>
                              <label htmlFor="classes_task">classes:</label>
                              <input type="text" name="classes" id="classes_task" value={this.state.element.classes} onChange={this.handleChange} />
                          </div>


                      </div>
                      <div className="actions">
                          <input type="submit" value="Submit" />
                      </div>

                  </form>
              </div>
          </Popup>
      </div>
    )
  }
}

export default App
