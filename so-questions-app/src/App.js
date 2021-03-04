import React, { useState } from 'react';
import './App.css';
import { getQuestions } from './getPostInfo.js';

function App() {
  const [tag, setTag] = useState('')
  const [questions, setQuestions] = useState([])
  var questionst = ['Question 1','Question 2','Question 3','Question 4','Question 5','Question 6',
  'Question 7','Question 8','Question 9','Question 10','Question 11','Question 12','Question 13',
  'Question 14','Question 15','Question 16','Question 17','Question 18','Question 19','Question 20'] 

  const handleSubmit = (event) => {
    event.preventDefault()
    setTag(event.target.innerText)
    const timeStamp = Math.floor(Date.now() / 1000)
    var timeStamp2 = new Date();
    timeStamp2.setDate(timeStamp2.getDate() - 7)

    // Promise.all([getQuestions(tag,0,0,'votes'), getQuestions(tag,0,0,'')]).then(([topVoted, topNewest]) => {
    //   setQuestions(topVoted+topNewest)
    // })
  }

  const handleClick = (event) => {
    event.target.classList.toggle("active")
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

  return (
    <div className="App">
      <p>Top 20 Stack Overflow Questions</p>
      <form onSubmit={handleSubmit} >
        <div className="search_box">
            <input type="text" className="search_box_input" placeholder="Enter A Tag To Search By"/>
            <div><input type="submit" className="search_box_submit" value="Search Stack Overflow"/></div>
        </div>
      </form>
      {questionst.map(question => 
      <div key={question.title}>
        <button className="collapsible" onClick={handleClick}>{question}</button>
        <div className="content">
          <p>I have a question about a thing?</p>
        </div>
      </div>)}
    </div>
  );
}

export default App;
