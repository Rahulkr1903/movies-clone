import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase'
import { fetchDataFromApi } from '../utils/Api';
import { useNavigate } from 'react-router-dom';

function HomeIcon(props) {
  return (
    <SvgIcon >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});
export default function Details() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState("");
  const [castData,setCastData]=useState("");
  const [deatilserror,setDetailsError]=useState(false);
  const [casterror,setCastError]=useState(false);
  const history=useNavigate();

  if(movieDetails !== ""){
    var dateString = movieDetails.release_date;
    var year = dateString.split("-")[0];
    
    var totalMinutes = movieDetails.runtime;
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
  }
  if(castData !==""){
    var castNames=castData.cast.map(d=>d.name);
    var commaSeparatedNames = castNames.join(', ');
    var targetCast = castData.crew.find(castMember => castMember.job === 'Director');
   var directorName=targetCast.name;
  }
 

  var query= `/movie/${movieId}?language=en-US` ;
  var castQuery= `/movie/${movieId}/credits?language=en-US` ;
  useEffect(() => {
    fetchDataFromApi(query)
    .then(data => {if(data.name==="AxiosError"){
      setDetailsError(true);
    }else{
      setMovieDetails(data);
    }
  })


    fetchDataFromApi(castQuery)
    .then(data => {if(data.name==="AxiosError"){
      setCastError(true);
    }else{
      setCastData(data);
    }
  })
},[]);

function homeClick(){
  history('/')
}

  return (
    <>
    
      <AppBar position="sticky">
        <Toolbar >
        <Typography variant="h6" component="h2" > MovieDetails</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box >
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={homeClick}
              sx={{ display: { xs: 'block', md: 'block' } }}
            >
             <HomeIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {deatilserror ? <Typography>Api error,Unable to fetch data, please try again later</Typography> :
      <Paper
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 250, height: 250 }}>
            <Img alt="No Image available" src={`https://image.tmdb.org/t/p/original${movieDetails && movieDetails.backdrop_path}`}/>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {movieDetails.title} ({movieDetails.vote_average} )
              </Typography>
              <Typography variant="body2" gutterBottom>
                {year} | {`0${hours}:${minutes}`} | {directorName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Cast: {commaSeparatedNames}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ paddingBlockStart:2 }}>
                Description:{movieDetails.overview}
              </Typography>
            </Grid>  
          </Grid> 
        </Grid>
      </Grid>
    </Paper>
}
    </>
  );
}