import React from 'react';
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import RelatedVideo from './RelatedVideo';
import './Video.css'

function Video() {
    let { id } = useParams()
    const [video, setVideo] = useState({})
    // const [relatedVideo, setRelatedVideo] = useState({})
    const [allComments, setAllComments] = useState([])
    const [comment, setComment] = useState({
        name: "",
        comment: ""
    })
    const [showDescription, setShowDescription] = useState(false);
    const [like, setLike] = useState(0)
    const [dislike, setDislike] = useState(0)
     
    function toggleDescription() {
      setShowDescription(!showDescription);
    }
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        }
    }

    const handleTextChange = (e) => {
        setComment({...comment, [e.target.id]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setAllComments([...allComments, comment])
        setComment({name: "",comment: ""})
    }

    useEffect(() => {
        fetch(`https://youtube.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.REACT_APP_API_KEY}&part=snippet,player`)
            .then(res => res.json())
            .then(res => {
            setVideo(res.items[0])
            // console.log(res.items[0])
            })    
            .catch(err => console.log(err))
    }, [])

    // useEffect(() => {
    //     fetch(`https://youtube.googleapis.com/youtube/v3/search?id=${id}&relatedToVideoId=${id}&type=video&key=${process.env.REACT_APP_API_KEY}&part=snippet`)
    //         .then(res => res.json())
    //         .then(res => {
    //         setRelatedVideo(res.items)
    //         console.log(res.items)
    //         })    
    //         .catch(err => console.log(err))
    // }, [])

    return (
        <div>
            <YouTube videoId={id} opts={opts}/>
           <h1>{video?.snippet?.title}</h1>
            <button onClick={()=>{setLike(like + 1)}}>👍🏽Likes {like}</button>
            <button onClick={()=>{setDislike(dislike + 1)}}>👎🏽 Dislikes {dislike}</button> 
            <button className='share'>Share</button>
            <br></br>
            <button onClick={()=>{toggleDescription()}}>{!showDescription ? "Show Description..." : "Hide Descrpition..."}</button>
            {showDescription ? <p><span>Description:</span> {video?.snippet?.description}</p>: null}

            <form onSubmit={handleSubmit}>
                <label htmlFor='name'>Name</label>
                <input type='text' placeholder='name' id='name' onChange={handleTextChange}/>
                <br/>
                <label htmlFor='comment'>Comment</label>
                <input type='text' id='comment' onChange={handleTextChange} />
                <br/>
                <input type='submit' ></input>
            </form>
            <hr/>
            <ul>
                {allComments.map(comment => {
                    return (
                        <li key={id}><span>{comment.name}:</span> {comment.comment}</li>
                        )
                    })}
            </ul>
            <div>

            <RelatedVideo id={id}/>
            </div>
        </div>
    );
}

export default Video;