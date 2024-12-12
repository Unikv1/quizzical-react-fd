import '../css/Question.css'
import {encode, decode} from 'html-entities';
import { useState, useEffect } from 'react'

export default function Question(props) {
    // console.log(props.questionObject.answers);
    const answerElements = props.questionObject.answers.map( (answer, index) => {
        const classText = props.checkAnswers ? 
            `quizzical--answer ${answer.isCorrect ? `correct ${answer.clicked ? '' : 'unclicked'}` : `incorrect ${answer.clicked ? '' : 'unclicked'}`}` :
            `quizzical--answer ${answer.clicked ? 'clicked' : ''}`
        return (
            <label 
                className={classText}
                key={index}
                htmlFor={`${props.questionObject.id}-${answer.text}`}
            >
                <input 
                    type="radio" 
                    id={`${props.questionObject.id}-${answer.text}`} 
                    name={props.questionObject.id}
                    value={answer.text}
                    checked={answer.clicked} 
                    onChange={(e) => props.onAnswerChange(e.target.name, answer.text) }
                    onClick={() =>props.toggleClick(props.questionObject.id, answer.text)}
                />
                
                {decode(answer.text)}
            </label>
        )
    })
    return (
        <div>
            <div className="quizzical--questions">
                <h2 className='quizzical--question--title'> {decode(props.questionObject.question)} </h2>
                <section className='quizzical--answers--div'>
                    {answerElements}
                </section>
            </div>
            <hr className="solid"></hr>
        </div>
    )
}