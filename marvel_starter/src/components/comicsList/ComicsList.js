import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './comicsList.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);   
    const [newItemloading, setNewItemloading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);    
    
    const { loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, intital) => {
        intital ? setNewItemloading(false) : setNewItemloading(true);
        getAllComics(offset)
            .then(onComicsLoaded)
    }

    const onComicsLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemloading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }    

    function renderItem(arr) {
        const items = arr.map((item, i) => {
            return(
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{item.titel}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>       
            )
        })
        return (
            <ul className="comics__grid">
                {items}       
            </ul>
        )
    };
   
    const renderComics = renderItem(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spiner = loading  && !newItemloading ? <Spinner/> : null; 

    return (
        <div className="comics__list">
            {errorMessage}
            {spiner}
            {renderComics}
            <button
                disabled={newItemloading}
                style={{"display" : comicsEnded ? "none" : "block"}} 
                onClick={() => onRequest(offset)}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;