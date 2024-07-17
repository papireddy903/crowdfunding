import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './Axios';

const MyProjects = () => {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])

    if (userId){
        
        useEffect(() => {
            const response = AxiosInstance.get("/projects/")
                                  .then((response) => {
                                    // console.log(res.data.username)

                                    const userProjects = response.data.filter(project => project.creator === parseInt(userId))
                                    setProjects(userProjects)

                                  }).catch((err) => {
                                    console.log(err)
                                  })

        }, [userId, navigate])

    }
    else{
        navigate("/login")
    }
    return (
        <div>
            {projects.length>0}
            {projects.map(project => (
                <h1 key={project.id}>{project.title}</h1>
            ))}
        </div>
    );
}

export default MyProjects
