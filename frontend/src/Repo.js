import './Repo.scss'

import React, {useEffect, useState} from 'react'

export default function Repo() {

    // const [fieldVal, setFieldVal] = useState('')
    const [resources, setResources] = useState([])

    function deleteResource(url){
        fetch('http://localhost:5000/resource/' + url, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
          }
        }).then(response => response.json())
        .then((data) => {
            if(data.success === true){
                getResources()
            }
        });
    }

    useEffect(() => {
        getResources()
    }, [])
    
    function getResources(){
        fetch('http://localhost:5000/resource')
        .then(response => response.json())
        .then(data => setResources(data));
    }

      
  return (
    <div className='repo'>
        <p className='repo__desc'>You can maintain lists of resources you find useful here</p>
        {/* <div className="repo__input">
            <div className='repo__input__area'>
                <input 
                onChange={(e) => setFieldVal(e.target.value)}  
                className='repo__input__area__field'
                placeholder='e.x. React'
                value={fieldVal}/> 
            </div>
            <button className='repo__input__add' 
            onClick={addResource}>Add</button>

        </div> */}

        <div className="repo__resources">
            {resources.map((resource, index) => (
                <div className="repo__resources__res" key ={index}>
                    <p className="repo__resources__res__name">{resource.name}</p>
                    {/* <button className="repo__resources__res__deleteBtn" onClick={deleteResource(resource.url)}>Delete</button> */}
                    <span className="repo__resources__res__goBtn"><a target='_blank' rel="noreferrer" href={resource.url} className="find__results__result__buttons__linkContainer__text">Go &gt;</a></span>
                </div>
            ))}
        </div>
    </div>
  )
}

