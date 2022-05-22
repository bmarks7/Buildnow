import React, {useState} from 'react'
import './Find.scss'

export default function Find() {

    const [searchVal, setSearchVal] = useState('')
    const [numResutlts, setNumResults] = useState(null)
    const [entitySets, setEntitySets] = useState([])
    const [titles, setTitles] = useState([])
    const [urls, setUrls] = useState([])
    const [searching, setSearching] = useState(false)

    function search(){ 
        console.log('search running')
        if (searchVal.length > 0){
            fetch("http://localhost:5000/sites/" + searchVal + '/' + numResutlts)
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                setEntitySets(data.setsOfEntities)
                setTitles(data.titles)
                setUrls(data.urls)
                setSearching(false)
            })
        }else{
            setSearching(false)
        }
    }

    function addResource(name, url){
        fetch('http://localhost:5000/resource', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                name: name,
                url: url
            })
        })
    }

  return (
    <div className='find'>
        <label className='find__queryLabel' htmlFor="">Website Search Query</label>
        <input 
        className='find__searchField' 
        type="text" 
        placeholder='e.x. React Router' 
        value={searchVal}
        onChange = {(e) => {setSearchVal(e.target.value)}}
        />
        <label className='find__numberLabel' htmlFor="">Number of Results</label>
        <input 
        type="number" 
        min="1" 
        className='find__numberField' 
        placeholder='e.x. 1'
        value={numResutlts}
        onChange = {(e) => {setNumResults(e.target.value)}}/>
        <button 
            disabled={searching} 
            className='find__searchBtn' 
            style={{backgroundColor: ((searching === true) ? '#d9d9d9' : 'white')}}
            onClick = {() => {
                setSearching(true)
                search()
            }}>{(searching === true) ? 'Searching...' : 'Search'}</button>

        <p className="find__resultsHeader">Results</p>

        <div className="find__results">
            {urls.map((url, index) => (
                <div className="find__results__result" key ={index}>
                    <p className="find__results__result__title">{titles[index]}</p>
                    <div className="find__results__result__entities">
                        {entitySets[index].map((entity, index) => (
                            <p key={index} className="find__results__result__entities__entity">{entity}</p>
                        ))}
                        
                    </div>
                    <div className="find__results__result__buttons">
                        <span className="find__results__result__buttons__linkContainer"><a target='_blank' rel="noreferrer" href={urls[index]} className="find__results__result__buttons__linkContainer__text">Go &gt;</a></span>
                        <button className="find__results__result__buttons__addBtn" onClick={() => addResource(titles[index], urls[index])}>Add</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
