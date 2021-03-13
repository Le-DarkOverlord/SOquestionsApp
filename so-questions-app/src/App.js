import React, { useState } from 'react';
import ReactHtmlParser from "react-html-parser";
import { getQuestions, getAnswers } from './getPostInfo.js';
import './App.css';

function App() {
  //Holds the current question list state
  const [questions, setQuestions] = useState([])
  //Holds the current answer list state
  const [answers, setAnswers] = useState([])
  //Holds the tag that was typed
  const [tag, setTag] = useState('')
  //Holds the question response time from Stack Apps API
  const [questionRespTime, setQuestionRespTime] = useState(0)
  //Holds the answer response time from Stack Apps API
  const [answerRespTime, setAnswerRespTime] = useState(0)

  //Get current timestamp and timestamp from one week ago
  const getDates = () => {
    const endDate = Math.floor(Date.now() / 1000)
    const timeOffset = new Date()
    timeOffset.setDate(timeOffset.getDate() - 7)
    timeOffset.setHours(0)
    timeOffset.setMinutes(0)
    timeOffset.setSeconds(0)
    const startDate = Math.floor(timeOffset.getTime() / 1000) - 21600
    return {startDate, endDate}
  }

  //Adjust timestamp to just the info needed, then add an id
  const adjustTimestamp = (list) => {
    for(var i=0; i<list.length; i++) {
      var date = new Date(0)
      date.setUTCSeconds(list[i].creation_date)
      date.setUTCHours(date.getUTCHours() + 6)
      list[i].creation_date = "" + date.toDateString() + " " + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0"+date.getMinutes() : date.getMinutes())
      list[i].order_id = i
    }
    return list
  }

  //Reduce to top 20 questions and merge together
  //Then adjust timestamps and comment timestamps
  const refineQuestionLists = (topVoted, topNewest) => {
    if(topVoted && topNewest) {
      if(topVoted.length > 10)
        topVoted.length = 10
      if(topNewest.length > 10)
      topNewest.length = 10
      var questionList = topVoted.concat(topNewest)
      questionList.sort((a,b) => {
        return b.creation_date - a.creation_date
      })
      questionList = adjustTimestamp(questionList)
      for(var i=0; i<questionList.length; i++) {
        if(questionList[i].comments)
          adjustTimestamp(questionList[i].comments)
      }
      setQuestions(questionList)
    }
  }

  //Toggle the active class name
  const toggle = (event) => {
    event.target.classList.toggle("active")
    var content = event.target.nextElementSibling
    if(content.style.maxHeight){
      content.style.maxHeight = null
    }
    else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }

  //On submit if not an empty query, then get top voted and top newest
  //questions, then refine the questions to correct format 
  //Response time starts when called and ends when response is returned and refined
  const handleSubmit = (event) => {
    if(tag !== " " && tag !== "") {
      var startTimer = Date.now() / 1000
      event.preventDefault()
      const dates = getDates()
      Promise.all([getQuestions(tag,dates.startDate,dates.endDate,'votes'), getQuestions(tag,dates.startDate,dates.endDate,'creation')]).then(([topVoted, topNewest]) => {
        if(topVoted && topNewest)
          refineQuestionLists(topVoted, topNewest)
      }).then(() => {
        setQuestionRespTime(((Date.now() / 1000) - startTimer).toFixed(5))
      })
    }
  }

  //When collapsible is clicked and is not already open, get all answers
  //and comments for that question, adjust their timestamp and toggle container
  //Response time starts when called and ends when response is returned and refined
  const handleClick = (event) => {
    var startTimer = Date.now() / 1000
    var id = event.target.id
    if(!event.target.classList.contains("active")) {
      getAnswers(questions[id].question_id).then((questionAnswers) => {
        questionAnswers = adjustTimestamp(questionAnswers)
        for(var i=0; i<questionAnswers.length; i++) {
          if(questionAnswers[i].comments)
            adjustTimestamp(questionAnswers[i].comments)
        }
        setAnswers(questionAnswers)
      }).then(() => {
        toggle(event)
      }).then(() => {
        setAnswerRespTime(((Date.now() / 1000) - startTimer).toFixed(5))
      })
    }
    else {
      toggle(event)
    }
  }

  //On text change, set the tag value
  const handleChange = (event) => {
    setTag(event.target.value)
  }

  return (
    <div className="App">
      <p>Top 20 Stack Overflow Questions</p>
      <form onSubmit={handleSubmit} >
        <div className="search_box">
            <input type="text" className="search_box_input" onChange={handleChange} placeholder="Enter A Tag To Search By"/>
            <div><input type="submit" className="search_box_submit" value="Search Stack Overflow"/></div>
        </div>
      </form>
      {questions && questions.map(question => 
      <div key={question.order_id}>
        <button className="collapsible" id={question.order_id} onClick={handleClick}>{ReactHtmlParser(question.title)}<br></br>{question.creation_date}<br></br>Votes: {question.score}</button>
          <div className="content">
            <div className="question">{ReactHtmlParser(question.body)}</div>
            {question.comments && question.comments.map(comment => 
            <div key={comment.comment_id} className="comments"><br></br>
              <b>{comment.order_id + 1}:</b> {ReactHtmlParser(comment.body)}    
              <b>&ensp;{comment.creation_date}&emsp;Votes: {comment.score}</b><br></br>
            </div>)}
            {answers && answers.map(answer => 
            <div className="answer_list" key={answer.answer_id}>
              <div className="answer_title"> Answer #{answer.order_id + 1}
              <br></br>{answer.creation_date}<br></br>Votes: {answer.score}</div>
              <div className="answer">{ReactHtmlParser(answer.body)}</div>
              {answer.comments && answer.comments.map(comment => 
              <div key={comment.comment_id} className="comments"><br></br>
                <b>{comment.order_id + 1}:</b> {ReactHtmlParser(comment.body)}
                <b>&ensp;{comment.creation_date}&emsp;Votes: {comment.score}</b><br></br>
              </div>)}
            </div>)}
          </div>
      </div>)}
      {questionRespTime !== 0 && <div>Question Response Time: {questionRespTime}s&emsp;Answer Response Time: {answerRespTime}s</div>}
    </div>
  );
}

export default App;
