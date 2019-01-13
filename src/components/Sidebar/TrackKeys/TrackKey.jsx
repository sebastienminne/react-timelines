import React from 'react'
import PropTypes from 'prop-types'

import TrackKeys from './'

const TrackKey = ({ track, toggleOpen, clickTrackButton }) => {
  const {
    title,
    tracks,
    isOpen,
    hasButton,
    sideComponent,
    weather
  } = track
  const isExpandable = isOpen !== undefined

  const buildSideComponent = () => {
    if (sideComponent) {
      return React.cloneElement(sideComponent)
    } else if (hasButton && clickTrackButton) {
      const handleClick = () => clickTrackButton(track)
      return <button className="rt-track-key__side-button" onClick={handleClick} />
    }

    return null
  }

  return (
    <li className="rt-track-key">
      <div className="rt-track-key__entry">
        { isExpandable &&
          <button
            title="Expand track"
            className={`rt-track-key__toggle ${isOpen ? 'rt-track-key__toggle--close' : 'rt-track-key__toggle--open'}`}
            onClick={() => toggleOpen(track)}
          >
            { isOpen ? 'Close' : 'Open' }
          </button>
        }
        <div className="rt-track-key__title">{title}</div>
        {weather && weather.length > 0 &&
          <div className={weather}>
          </div>
        }

        { buildSideComponent() }
      </div>
      { isOpen && tracks && tracks.length > 0 &&
        <TrackKeys tracks={tracks} toggleOpen={toggleOpen} />
      }
    </li>
  )
}

TrackKey.propTypes = {
  track: PropTypes.shape({
    title: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.shape({})),
    isOpen: PropTypes.bool,
    hasButton: PropTypes.bool,
    weather: PropTypes.string
  }),
  toggleOpen: PropTypes.func,
  clickTrackButton: PropTypes.func
}

TrackKey.defaultProps = {
  clickTrackButton: undefined
}

export default TrackKey
