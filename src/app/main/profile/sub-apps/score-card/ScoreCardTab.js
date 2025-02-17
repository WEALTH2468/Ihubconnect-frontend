import { useSelect } from '@mui/base'
import {useState, useEffect, useSyncExternalStore} from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from 'app/store/userSlice'
import { Card, CardContent, Typography } from '@mui/material'

const ScoreCardApp = ({setSelectedTab}) => {

    //CHECKING IF PROFILE IS UPDATED
    const user = useSelector(selectUser)

    //Set the title of the page
    useEffect(()=>{
        document.title ="Ihub Connect - Score Card";
        !user.avatar && setSelectedTab(1)

      },[])
    
    return (
        <div>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Score Card
            </Typography>
            {/* Add your score card content here */}
          </CardContent>
        </Card>
      </div>
    )
}

export default ScoreCardApp