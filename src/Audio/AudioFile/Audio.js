import React, { Component } from "react";
import ReactDOM from "react-dom";
/**
 * Use case: audio player with dynamic source in react
 *
 * Usage:
 *   <AudioPlayerDOM src={this.state.currentFile}/>
 *
 * Todo: make a better api, actually pass props through
 * Todo: use children instead of passing
 */
export default class AudioPlayerDOM extends Component {
  componentWillReceiveProps(nextProps) {
    // Find some DOM nodes
    const element = ReactDOM.findDOMNode(this);
    const audio = element.querySelector("audio");
    const source = audio.querySelector("source");

    // When the url changes, we refresh the component manually so it reloads the loaded file
    if (nextProps.src && nextProps.src !== this.props.src) {
      // Change the source
      source.src = nextProps.src;
      // Cause the audio element to load the new source
      audio.load();
    }
  }
  newFunc = () => {
    const audio = document.querySelector("audio");
    audio.oncanplaythrough = (event) => {
      // console.log('I think I can play thru the entire ' + '
      //     video without ever having to stop to buffer.');
    };
  };
  audioupdated = () => {
    const video = document.querySelector("video");

    video.addEventListener("timeupdate", (event) => {
      console.log("The currentTime attribute has been updated. Again.");
    });
  };
  render() {
    // this.videoupdated();
    // console.log("Audio Type", this.props.src);
    return (
      <div>
        <audio controls preload="metadata" buffer>
          <source src={this.props.src} type="audio/x-wav" />
          {/* <source src="https://www.bensound.com/bensound-music/bensound-summer.mp3"  type="audio/ogg" /> */}
        </audio>
        {/* <button onClick={this.newFunc} >CLick me </button> */}
      </div>
    );
  }
}
