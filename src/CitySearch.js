import React, { Component } from 'react';
import { InfoAlert } from './Alert';

class CitySearch extends Component {
  state = {
    query: '',
    suggestions: [],
    showSuggestions: undefined
  }


/**
 * @description handleInputChanged function handles the input change event. It will update the query state and showSuggestions state. It will also filter the suggestions based on the query.
 * @param {*} event 
 * @returns  {string} value
 */


  handleInputChanged = (event) => {
    const value = event.target.value;
    let suggestions = [];
    if (Array.isArray(this.props.locations)) {
      suggestions = this.props.locations.filter((location) => {
        return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
      });
    }
    if (suggestions.length === 0) {
      this.setState({
        query: value,
        infoText: 'We can not find the city you are looking for. Please try another city',
      });
    } else {
      return this.setState({
        query: value,
        suggestions,
        infoText:''
      });
    }
  };

/** 
 *  @description handleItemClicked function handles the click event on the suggestion list. It will update the query state and showSuggestions state. It will also call the updateEvents function to update the events list.
 * @param {*} suggestion
 * @returns {string} suggestion
 */
 


  handleItemClicked = (suggestion) => {
    this.setState({
      query: suggestion,
      showSuggestions: false,
      infoText:''
    });
  
    this.props.updateEvents(suggestion);
  }

  render() {
    return (
      <div className="CitySearch">
        <InfoAlert text={this.state.infoText} />
        <input
          type="text"
          className="city"
          value={this.state.query}
          onChange={this.handleInputChanged}
          placeholder="Search for location..."
          onFocus={() => {
            this.setState({ showSuggestions: true });
          }}
        />
        <ul
          className="suggestions"
          style={this.state.showSuggestions ? {} : { display: "none" }}
        >
          {this.state.suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => this.handleItemClicked(suggestion)}
            >
              {suggestion}
            </li>
          ))}
          <li onClick={() => this.handleItemClicked("all")}>
            <b>See all cities</b>
          </li>
        </ul>
      </div>
    );
  }
}
export default CitySearch;