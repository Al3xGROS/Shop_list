import React, { useState, useEffect } from 'react';

function LoginPagev2() {
    const [id, setId] = useState("");
    const [courses, setCourses] = useState([]);
    const [seq, setSeq] = useState("");
    const [registerServ, setRegisterServ] = useState("");
    const [coursesServ, setCoursesServ] = useState("");

    useEffect(() => {
        let register = window.localStorage.getItem('registerServ');
        let courses = window.localStorage.getItem('coursesServ');
        if (register != null) {
            setRegisterServ(JSON.parse(register));
        }
        if (courses != null) {
            setCoursesServ(JSON.parse(courses));
        }
    }, [])

    useEffect(() => {
        if (id !== "" && courses !== [] && seq !== "") {
            window.localStorage.setItem('apiId', JSON.stringify(id));
            window.localStorage.setItem('apiList', JSON.stringify(courses));
            window.localStorage.setItem('apiSeq', JSON.stringify(seq));
        }
        if (registerServ !== "" &&  coursesServ !== "") {
            window.localStorage.setItem('registerServ', JSON.stringify(registerServ));
            window.localStorage.setItem('coursesServ', JSON.stringify(coursesServ));
        }
    }, [id, courses, seq, registerServ, coursesServ]);

    const login = () => {
        fetch(registerServ)
            .then(response => response.json())
            .then(data => {
                setId(data.id);
                setSeq(data.sequence);
                setCourses(Object.values(data.courses));
                setTimeout(() => {
                    window.location.href = "/ShopList";
                }, 1000);
            })
            .catch(error => {
                alert("Bruh! Error (Wrong link or server down)!");
                console.error('There was an error!', error);
            });
    }

    const clearStorage = () => {
        window.localStorage.clear();
        setRegisterServ("");
        setCoursesServ("");
    }

    return (
        <div className="page">
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEF109VFjmqGmIY/Y4HV4d3Gp2irVfcrp" crossorigin="anonymous"></link>
            <div className="page_form_1">
                <div className="form_header">
                    <h3>Login</h3>
                </div>
                <div className="form_inputs">
                    <h4>Choose your server</h4>
                    <label>
                        New user 
                        <input type="checkbox" id="clear" name="clear" onChange={clearStorage}/>
                    </label>
                    <label>Register <br/><a>(Mine: https://alexandregros.esilv.olfsoftware.fr/shopList/register.php)</a></label>
                    <input title="If you don't know one you can always take the one mention before" type="text" id="register" name="courses" placeholder="🔗    Type the complete link to the \register" onChange={(event) => setRegisterServ(event.target.value)} required />
                    <label>Courses <br/><a>(Mine: https://alexandregros.esilv.olfsoftware.fr/shopList/courses.php)</a></label>
                    <input title="If you don't know one you can always take this one mention before" type="text" id="courses" name="courses" placeholder="🔗    Type the complete link to the \courses" onChange={(event) => setCoursesServ(event.target.value)} required />
                </div>
                <button className="form_button_1" onClick={login}>LOGIN</button>
                <div className="form_footer">
                    <p>Sponso</p>
                    <div className="social_icons">
                        <i className="fab fa-facebook fa-3x" style={{color:'#1b74e4'}}></i>
                        <i className="fab fa-twitter fa-3x" style={{color:'#1da1f2'}}></i>
                        <i className="fab fa-google fa-3x"></i>
                    </div>
                    <p>... just kidding ...</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPagev2;