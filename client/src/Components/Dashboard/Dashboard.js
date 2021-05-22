import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { BASE_URL } from '../../config/serverUrl'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import './dashboard.css'
const Dashboard = () => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [songs, setSongs] = useState([])

  useEffect(() => {
    if (token === null) {
      window.location.href = '/'
    } else {
      getAllSongs()
    }
  }, [])
  const getAllSongs = () => {
    axios
      .get(`${BASE_URL}songs/getAllSongs`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      .then(response => {
        setSongs(response.data.songs)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const voteClickHandler = (vote, songId) => {
    const newVote = {
      voteType: vote
    }
    axios
      .post(
        `${BASE_URL}songs/vote/${songId}`,
        newVote,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      .then(response => {
        if (response.status === 200) {
          getAllSongs()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  const getUpVotedSongs = () => {
    axios
      .get(`${BASE_URL}songs/getUpVoted`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      .then(response => {
        setSongs(response.data.songs)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const getTrendingSongs = () => {
    axios
      .get(`${BASE_URL}songs/getTrending`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      .then(response => {
        setSongs(response.data.songs)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const getImage=(url)=>{
    if(url!='' || !url){
      return <img src={url} className='songImage'></img> 
    }
    return <div>No Image</div>
  }
  return (
    <div className='dashboardWrapper'>
      <div className='filterButtonsWrapper'>
        <button onClick={getUpVotedSongs} className='filterButton'>Liked Songs</button>
        <button onClick={getTrendingSongs} className='filterButton'>Trending Songs</button>
        <button onClick={getAllSongs} className='removeFilterButton'>Remove Filter</button>
      </div>

      {songs.length > 0 ?
        (
          songs.map((song, i) => {
            return (
              <div key={i} className='songWrapper'>
                {getImage(song.imageUrl)}
                <div className='songContent'>
                  <p>Song Name: - {song.title}</p>
                  <p>Song Artist: - {song.artist}</p>
                  <p>Song Genre: - {song.genre}</p>
                  <p>Song Album: - {song.album}</p>
                </div>
                <div className='songVotes'>
                  <div className='voteWrapper'>
                    {song.upVotes}
                    <button className='voteButton' onClick={() => voteClickHandler('upVote', song._id)}>
                      <ThumbUpAltIcon></ThumbUpAltIcon>
                    </button>
                  </div>
                  <div className='voteWrapper' onClick={() => voteClickHandler('downVote', song._id)}>
                    {song.downVotes}
                    <button className='voteButton'>
                      <ThumbDownAltIcon></ThumbDownAltIcon>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )
        :
        (
          <div>No Songs Found</div>
        )
      }
    </div>
  )
}

export default Dashboard