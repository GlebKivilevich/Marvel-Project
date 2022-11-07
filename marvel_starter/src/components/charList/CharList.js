import './charList.scss';

import React,{ useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spiner/Spinner';
import useMarvelService from '../../services/MarvelService';


const CharList = (props) => {

    const [charList, setCharList] = useState([]);  
    const [newItemloading, setNewItemloading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);  
  
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);       
    }, []);

    const onRequest = (offset, intital) => {    
        intital ? setNewItemloading(false) : setNewItemloading(true);
        getAllCharacters(offset)
            .then(onCharLoadded)
    }


    const onCharLoadded =   (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        } 
        
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemloading(false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
        
    }

    const itemRefs = useRef([]);
    
    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove("char__item_selected"));
        itemRefs.current[id].classList.add("char__item_selected");
        itemRefs.current[id].focus();
    }

    const renderItems =(arr) => {
        const items = arr.map((item, i) => {
            let imgStyle = {"objectFit": "cover"};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {"objectFit": "contain"};
            }

            return (
                <li 
                    className="char__item" //char__item__selected
                    tabIndex={0}
                    key={item.id}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                        }}
                        
                    onKeyPress={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
            
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemloading ? <Spinner/> : null;
        // const content = !(loading && !newItemloading || error) ? items : null;
        
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
                <button 
                    className="button button__main button__long"
                    disabled={newItemloading}
                    style={{"display": charEnded ? "none" : "block"}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}
    
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}
export default CharList;