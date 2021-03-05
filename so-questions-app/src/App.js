import React, { useState } from 'react';
import './App.css';
import { getQuestions } from './getPostInfo.js';

function App() {
  const [questions, setQuestions] = useState([])
  const [tag, setTag] = useState('')
  // var questionst = ['Question 1','Question 2','Question 3','Question 4','Question 5','Question 6',
  // 'Question 7','Question 8','Question 9','Question 10','Question 11','Question 12','Question 13',
  // 'Question 14','Question 15','Question 16','Question 17','Question 18','Question 19','Question 20'] 

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

  const refineQuestionLists = (topVoted, topNewest) => {
    topVoted.length = 10
    topNewest.length = 10
    var questionList = topVoted.concat(topNewest)
    questionList.sort((a,b) => {
      return a.creation_date < b.creation_date
    })
    for(var i=0; i<questionList.length; i++) {
      var date = new Date(0)
      date.setUTCSeconds(questionList[i].creation_date)
      date.setUTCHours(date.getUTCHours() + 6)
      questionList[i].creation_date = "" + date.toDateString() + " " + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0"+date.getMinutes() : date.getMinutes())
    }
    setQuestions(questionList)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const dates = getDates()
    Promise.all([getQuestions(tag,dates.startDate,dates.endDate,'votes'), getQuestions(tag,dates.startDate,dates.endDate,'creation')]).then(([topVoted, topNewest]) => {
      refineQuestionLists(topVoted, topNewest)
    })
  }

  const handleClick = (event) => {
    event.target.classList.toggle("active")
    console.log(event)
    var content = event.target.nextElementSibling
    //var id = event.target.question_id
    if(content.style.maxHeight){
      content.style.maxHeight = null
    }
    else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
    // Promise.all([getQuestionAnswers(id), getQuestionComments(id)])
    // .then(([questionAnswers, questionComments]) => {
    //   setQuestionAnswers(questionAnswers)
    //   setQuestionComments(questionComments) 
    // })
    // foreach(answer in questionAnswers) {
    //  wrong --> getAnswerComments(answer.answer_id)
    //}
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
      <div key={question.title}>
        <button className="collapsible" onClick={handleClick}>{question.title}<br></br>{question.creation_date}<br></br>Votes: {question.score}</button>
        <div className="content">
          <p>I have a question about a thing?</p>
        </div>
      </div>)}
    </div>
  );
}

export default App;
