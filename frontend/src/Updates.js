import React, {useState, useEffect} from 'react'
import './Updates.scss'

export default function Updates() {

  // var schedule = require('node-schedule');

  let documentations = {'React': 'https://reactjs.org/versions/', 'Django': 'https://docs.djangoproject.com/en/4.0/releases/', 'Flask': 'https://flask.palletsprojects.com/en/2.1.x/'}
  let updated = {'React': false, 'Django': false, 'Flask': false}
  const [techList, setTechList] = useState([])
  const [selected, setSelected] = useState([])
  const [fieldVal, setFieldVal] = useState('')

  async function deleteTech(tech){
      await fetch('http://localhost:5000/update/' + tech, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
        }
      })

      getTech()
  }

  async function addTech(){
    if(fieldVal.length !== 0){
      await fetch('http://localhost:5000/addTech', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          name: fieldVal,
          url: documentations[fieldVal],
        })
      })
    }

    getTech()
  }

  useEffect(() => {
    getTech()
  }, [])

  function getTech(){
    fetch('http://localhost:5000/getTech')
        .then(response => response.json())
        .then(data => setTechList(data));
  }

  return (
    <div className='updates'>
       <p className='updates__desc'>With new versions of technologies being released so frequently, this page allows you to get those updates easily. Technologies with an update are highlighted in yellow</p>

      <div className="updates__input">
      <div className='updates__input__area'>
        <datalist id="suggestions">
          <option>React</option>
          <option>Django</option>
          <option>Flask</option>
        </datalist>
        <input 
        value={fieldVal} 
        onChange={(e) => setFieldVal(e.target.value)}  
        autoComplete="on" 
        list="suggestions" 
        className='updates__input__area__field'
        placeholder='Select from list or search'/> 
      </div>
        <button className='updates__input__add' 
        onClick={addTech}>Add</button>
      </div>

      {selected.length > 0 &&
        <div className="updates__track">
          {techList.map((tech, index) => (
            <div className="updates__track__item" key ={index} style={{backgroundColor: tech.updated === true ? 'yellow' : 'white'}}>
              <p className="updates__track__item__name">{tech.name}</p>
              <div className='updates__track__item__buttons'>
                <span className="updates__track__item__linkContainer"><a target='_blank' rel="noreferrer" href={tech.url} className="updates__track__item__linkContainer__link">Go &gt;</a></span>
                <button className="updates__track__item__deleteBtn" onClick={deleteTech(tech.name)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      }

    </div>
  )
}
