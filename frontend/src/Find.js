import React, {useState} from 'react'
import './Find.scss'

export default function Find() {

    const [searchVal, setSearchVal] = useState('')
    const [numResutlts, setNumResults] = useState(null)
    const [entitySets, setEntitySets] = useState([])
    const [titles, setTitles] = useState([])
    const [urls, setUrls] = useState([])


    async function search(){ 
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
            })
        }
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
        <button className='find__searchBtn' onClick = {search}>Search</button>

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
                    <p className="find__results__result__linkContainer"><a href={urls[index]} className="find__results__result__linkContainer__text">Go &gt;</a></p>
                </div>
            ))}
        </div>
    </div>
  )
}
