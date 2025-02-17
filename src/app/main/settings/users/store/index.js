import {combineReducers} from "@reduxjs/toolkit"
import users from "./usersSlice"
import user from './userSlice'
import countries from './countriesSlice'
import tags from './tagsSlice'
import settings from "./settingsSlice"

const reducer = combineReducers({
    users,
    user,
    tags,
    countries,
    settings
})

export default reducer;
