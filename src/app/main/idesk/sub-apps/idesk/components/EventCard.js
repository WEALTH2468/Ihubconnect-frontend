//React
import {useState,useEffect} from 'react';
//Material UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
 //Fuse
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';


//Utitilities
import axios from 'axios';
import { motion } from 'framer-motion';

const EventCard = () => {

  

    const container = {
        show: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      };
    
      const item = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0 },
      };
  return (
    <>
         
           
          
    </>
  )
}

export default EventCard