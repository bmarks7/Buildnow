import React from 'react'
import './Result.scss'

export default function (props) {
  return (
    <div className='result'>
        <p>{props.link}</p>
        <div className="result__entities">
            {props.entities.map((entity) => (
                <p>{entity}</p>
            ))}
        </div>
    </div>
  )
}
