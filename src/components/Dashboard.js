import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SvgIcon from '@mui/material/SvgIcon';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import {useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchDataFromApi } from '../utils/Api';


function HomeIcon(props) {
  return (
    <SvgIcon >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const styles = {
    container: {
        margin: "15px",
      display: "flex", 
      flexWrap: "wrap", 
      gap: "16px" 
    },
    card: {
      width: "calc(20% - 16px)", 
      display: "flex",
      flexDirection: "column",
      "@media (max-width: 750px)": {
        flexBasis: "calc(33.33% - 16px)", 
      },
      "@media (max-width: 500px)": {
        flexBasis: "calc(100% - 16px)", 
      },
       
    },
    cardContent: {
      flexGrow: 1 
    },
    cardImage: {
      height: 140,
      objectFit: "cover" 
    }
  };
  


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
     
    },
  },
}));


export default function Dashboard() {

  
  const [apiData,setApiData]=useState([]);
  const [searchformData,setsearchformData]=useState("");
  const [searchData,setSearchData]=useState("");
  const [error,setError]=useState(false);
  const [noMovie,setNoMovie]=useState(false);

  var query='/movie/upcoming?language=en-US&page=1';
  useEffect(() => {
    fetchDataFromApi(query)
    .then(data => {if(data.name==="AxiosError"){
      setError(true);
    }else{
      setApiData(data.results);
    }
  })
}, [])

   function onSearchChange(e){
    e.preventDefault();
    setsearchformData(e.target.value);
    setSearchData("")

   }
  
   function onSearch(e){
    e.preventDefault();
    var query= `/search/movie?query=${searchformData}&include_adult=false&language=en-US&page=1` ;
    fetchDataFromApi(query)
    .then(data => 
      {if(data.name==="AxiosError"){
      setError(true);
    }else{
      setSearchData(data.results);
      if(data.results.length==0){
        setNoMovie(true)
      }
    }
  })
   }
 

    const history=useNavigate();
    function handleClick(movieId){
        history(`/detail/${movieId}`)
    }
    function homeClick(){
      setSearchData("")
    }

    if (error) {
      return <Typography>Api Error, please try again later,, Please refersh</Typography>;
    }
    if(noMovie){
      return <Typography>No such movies available, Please refersh</Typography>;
    }
  return (
    <>  
      <AppBar position="sticky">
        <Toolbar component="form" onSubmit={onSearch}>
          <Search   >
            <SearchIconWrapper >
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={onSearchChange}
              value={searchformData}
              />
            <Button variant="text" type="submit" color="secondary" onClick={onSearch} sx={{ marginLeft: 2 }}>Search</Button>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'block', sm: 'block', md: 'block' } }}>
            <IconButton size="large" edge="end" color="inherit" onClick={homeClick}>
               <HomeIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
     
     
    {searchData ? 
   
     <Box style={styles.container}>
     {searchData.map((data, index) => (
       <Card key={index} sx={styles.card} onClick={() => handleClick(data.id)}>
         <CardActionArea>
           <CardMedia
             component="img"
             style={styles.cardImage}
             image={`https://image.tmdb.org/t/p/original${data && data.backdrop_path}`}
             alt={"No Image available"}
           />
           <CardContent style={styles.cardContent}>
             <Typography sx={{ display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'}}  
                gutterBottom variant="h10" component="Box">
                <span>{data.title}</span><span>({data.vote_average})</span>   
             </Typography>
           </CardContent>
         </CardActionArea>
         <Typography sx={{overflow: "hidden",whiteSpace: "nowrap",textOverflow: "ellipsis"}} component="Box">
          {data.overview}
          </Typography>
       </Card>
     ))}
   </Box> 
   : 
    <Box style={styles.container}>
      {apiData.map((data, index) => (
        <Card key={index} sx={styles.card} onClick={() => handleClick(data.id)}>
          <CardActionArea>
            <CardMedia
              component="img"
              style={styles.cardImage}
              image={`https://image.tmdb.org/t/p/original${data && data.backdrop_path}`}
              alt={data.title}
            />
            <CardContent style={styles.cardContent}>
              <Typography sx={{ display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'}}  
                 gutterBottom variant="h10" component="Box">
                  <span>{data.title}</span><span>({data.vote_average})</span>
              </Typography>
            </CardContent>
          </CardActionArea>
          <Typography sx={{overflow: "hidden",whiteSpace: "nowrap",textOverflow: "ellipsis"}} component="Box">
           {data.overview}
          </Typography>
        </Card>
      ))}
    </Box>
    
}

    </>
  );
}