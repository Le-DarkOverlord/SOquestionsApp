import React, { useState } from 'react';
import ReactHtmlParser from "react-html-parser";
import './App.css';
import { getQuestions, getAnswers } from './getPostInfo.js';

function App() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [tag, setTag] = useState('')
  const [questionRespTime, setQuestionRespTime] = useState(0)
  const [answerRespTime, setAnswerRespTime] = useState(0)


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

  const refineQuestionLists = (topVoted, topNewest) => {
    if(topVoted && topNewest) {
      if(topVoted.length > 10)
        topVoted.length = 10
      if(topNewest.length > 10)
      topNewest.length = 10
      var questionList = topVoted.concat(topNewest)
      questionList.sort((a,b) => {
        return a.creation_date - b.creation_date
      })
      questionList = adjustTimestamp(questionList)
      for(var i=0; i<questionList.length; i++) {
        if(questionList[i].comments)
          adjustTimestamp(questionList[i].comments)
      }
      setQuestions(questionList)
    }
  }

  const handleSubmit = (event) => {
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

  const handleClick = (event) => {
    //make all other non active
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
        setAnswerRespTime(((Date.now() / 1000) - startTimer).toFixed(5))
      })
    }

    event.target.classList.toggle("active")
    var content = event.target.nextElementSibling
    if(content.style.maxHeight){
      content.style.maxHeight = null
    }
    else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }

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
        <button className="collapsible" id={question.order_id} onClick={handleClick}>{question.title}<br></br>{question.creation_date}<br></br>Votes: {question.score}</button>
          <div className="content">
            <div className="question">{ReactHtmlParser(question.body)}</div>
            {question.comments && question.comments.map(comment => 
            <div key={comment.comment_id} className="comments"><br></br>
              {comment.order_id + 1}: {ReactHtmlParser(comment.body)}    
              <b>&ensp;{comment.creation_date}&emsp;Votes: {comment.score}</b><br></br>
            </div>)}
            {answers && answers.map(answer => 
            <div key={answer.answer_id}>
              <div className="answer_title"> Answer {answer.order_id + 1}
              <br></br>{answer.creation_date}<br></br>Votes: {answer.score}</div>
              <div className="answer">{ReactHtmlParser(answer.body)}</div>
              {answer.comments && answer.comments.map(comment => 
              <div key={comment.comment_id} className="comments"><br></br>
                {comment.order_id + 1}: {ReactHtmlParser(comment.body)}
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
