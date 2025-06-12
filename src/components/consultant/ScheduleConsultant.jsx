import React, {useState, useEffect, useContext} from "react";
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext'
import { API } from "../../config";
import '../../css/consultant/scheduleConsultant.css'

const ScheduleConsultant = () => {
    const [ schedules, setSchedule ] = useState([])
    return(
        <div className="container-scheduleConsultant-consultant">

        </div>
    )
}

export default ScheduleConsultant;