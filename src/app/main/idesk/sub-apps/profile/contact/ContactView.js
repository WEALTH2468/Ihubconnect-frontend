import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import format from 'date-fns/format';
import { selectDepartments, selectUnits } from "app/store/settingsSlice";


function AboutTab({ setEdit }) {
  const user = useSelector(selectUser);
  const departments = useSelector(state => selectDepartments(state))
  const units = useSelector(state => selectUnits(state))
  const userDepartments  = departments.filter( department => user.departments.some(id => id == department._id))
  const userUnits = units.filter(unit => user.units.some(id => id == unit._id))

  const [data, setData] = useState(null);
  const test = (x) => x + 1;

  useEffect(() => {
    axios.get("/api/profile/about").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) {
    return null;
  }

  const { general, work, contact, groups, friends } = data;

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
    <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
      <Card component={motion.div} variants={item} className="w-full mb-32">
        <div className="flex items-center justify-end mr-auto mb-4 p-20">
          <Button
            variant="contained"
            color="secondary"
            // component={NavLinkAdapter}
            onClick={() => setEdit((prev) => !prev)}
          >
            <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
            <span className="mx-8">Edit</span>
          </Button>
        </div>
        <div className="px-32 pt-24">
          <Typography className="text-2xl font-semibold leading-tight">
            General Information
          </Typography>
        </div>

        <CardContent className="px-32 py-24">
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Gender
            </Typography>
            <Typography>{user.gender}</Typography>
          </div>
          
        <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Birthday
            </Typography>
            <Typography>
              {contact.birthday && format(new Date(contact.birthday), "MMMM d, y")}
            </Typography>
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Birthday
            </Typography>
            <Typography>
              {user.birthday && format(new Date(user.birthday), "MMMM d, y")}
            </Typography>
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">City</Typography>

            {
              <div className="flex items-center" key={location}>
                <Typography>{user.city}</Typography>
                <FuseSvgIcon className="mx-4" size={16} color="action">
                  heroicons-outline:location-marker
                </FuseSvgIcon>
              </div>
            }
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              About Me
            </Typography>
            <Typography>{user.aboutMe}</Typography>
          </div>
        </CardContent>
      </Card>

      <Card component={motion.div} variants={item} className="w-full mb-32">
        <div className="px-32 pt-24">
          <Typography className="text-2xl font-semibold leading-tight">
            Work
          </Typography>
        </div>

        <CardContent className="px-32 py-24">
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Job Position
            </Typography>
            <Typography>{user.jobPosition}</Typography>
          </div>

         
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">Departments</Typography>
            <table className="">
              <tbody>
                {userDepartments && userDepartments.map((department) => (
                  <tr key={department._id}>
                    <td>
                      <Typography>{department?.name}</Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">Units</Typography>
            <table className="">
              <tbody>
                {userUnits && userUnits.map((unit) => (
                  <tr key={unit._id}>
                    <td>
                      <Typography>{unit?.name}</Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        
        </CardContent>
      </Card>

      <Card component={motion.div} variants={item} className="w-full mb-32">
        <div className="px-32 pt-24">
          <Typography className="text-2xl font-semibold leading-tight">
            Contact
          </Typography>
        </div>

        <CardContent className="px-32 py-24">
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Address
            </Typography>
            <Typography>{user.address}</Typography>
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">Tel.</Typography>

            {user.phoneNumbers && user.phoneNumbers.map((user) => (
              <div className="flex items-center" key={user.phoneNumber}>
                <Typography>{user.phoneNumber}</Typography>
              </div>
            ))}
          </div>

        

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Emails
            </Typography>

            {user.emails && user.emails.map((user) => (
              <div className="flex items-center" key={user.email}>
                <Typography>{user.email}</Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AboutTab;
