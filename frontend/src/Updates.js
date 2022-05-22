import React, {useState, useEffect} from 'react'
import './Updates.scss'

export default function Updates() {

  let documentations = {'React': 'https://reactjs.org/versions/', 'Django': 'https://docs.djangoproject.com/en/4.0/releases/', 'Flask': 'https://flask.palletsprojects.com/en/2.1.x/'}
  let updated = {'React': false, 'Django': false, 'Flask': false}
  const [selected, setSelected] = useState([])
  const [fieldVal, setFieldVal] = useState('')

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
        .then(data => setSelected(data));
  }

  return (
    <div className='updates'>
       <p className='updates__desc'>With new versions of technologies being released so frequently, this page allows you to get those updates easily.</p>

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
        className='updates__input__area__field'/> 
      </div>
        <button className='updates__input__add' 
        onClick={addTech}>Add</button>
      </div>

      {selected.length > 0 &&
        <div className="updates__track">
          {selected.map((tech, index) => (
            <div className="updates__track__item" key ={index} style={{backgroundColor: updated[tech] === true ? 'yellow' : 'white'}}>
              <p>{tech.name}</p>
              <p>{tech.url}</p>
            </div>
          ))}
        </div>
      }

    </div>
  )
}
