import '/src/css/ExpensesPieChart.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    plugins
} from 'chart.js';
import { useState } from 'react';
import { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

//INITALIZE USER ID AS 0
let user_id = 0;

function InputContainer({ category, changeFunction, value }) {
    return (
        <div
            className="pie-chart-input-container"
        >
            <label
                htmlFor={category.toLowerCase()}
                id={category.toLowerCase() + "-label"}
            >
                {category + ": "}
            </label>
            <input
                id={category.toLowerCase()}
                type="number"
                onChange={changeFunction}
                value={value}
            />
        </div>
    );
}

function PieChartContainer(props) {
    return (
        <div className="pie-chart-container">
            <div className="title-login-signup-container">
                <h2 className="pie-chart-title">Expenses Pie Chart</h2>
                {!props.loggedIn ?
                    <button className="login-signup-btn btn btn-primary" onClick={props.handleLoginRenderedChange}>Login/Signup</button>
                    : <button className="login-signup-btn btn btn-primary" onClick={props.handleSignout}>Signout</button>
                }
            </div>
            <div className="pie-chart-graph-container">
                <Doughnut data={props.data} options={props.options} plugins={props.plugins} />
            </div>
            <div className="pie-chart-inputs-container">
                <InputContainer {...props.vehicleProps} />
                <InputContainer {...props.rentProps} />
                <InputContainer {...props.groceryProps} />
                <InputContainer {...props.entertainmentProps} />
                <InputContainer {...props.resturantProps} />
            </div>
            {props.loggedIn ?
                <button className='save-data-btn btn btn-primary' onClick={props.handleSave}>Save Data</button>
                : null}
        </div>);
}


function LoginSignupContainer(props) {
    return (<div className="login-signup-container">
        <h2>Login/Signup</h2>
        <div className="inputs-container">
            <div className="input-container">
                <input type="email" id="email-input" value={props.emailValue} onChange={props.handleChange(props.setEmailValue)} placeholder='Enter Email: '></input>
            </div>
            <div className="input-container">
                <input type="password" id="password-input" value={props.passValue} onChange={props.handleChange(props.setPassValue)} placeholder="Enter Password: "></input>
            </div>
        </div>
        <div className="login-signup-button-container">
            <button className="login-confirm-btn btn btn-primary" onClick={props.handleLogin}>Login</button>
            <button className="signup-confirm-btn btn btn-primary" onClick={props.handleSignup}>Signup</button>
        </div>
        {props.signingupRendered ? <h3>Signing Up...</h3> : null}
        {props.signupConfirmationRendered ? <h3>Signup Successful, Please Login</h3> : null}
        {props.errorSigningUpRendered ? <h3>Error Signing Up, Try Again</h3> : null}
    </div>);
}


function ExpensesPieChart() {
    //CREATE GRAPH INITIAL DATA
    const [data, setData] = useState({
        labels: [
            'Vehicle', 'Rent/Mortgage',
            'Grocery', 'Entertainment',
            'Resturant'
        ],
        datasets: [{
            label: 'Category',
            data: [500, 900,
                400, 200,
                150
            ],
            backgroundColor: [
                '#3D1766', '#FF0032',
                '#CD0404', 'purple',
                '#A459D1'
            ],
            borderColor: [
                '#3D1766', '#FF0032',
                '#CD0404', 'purple',
                '#A459D1'
            ],
        }],
    });

    //CREATE MOST VALUES
    const [vehicleValue, setVehicleValue] = useState(500);
    const [rentValue, setRentValue] = useState(900);
    const [groceryValue, setGroceryValue] = useState(400);
    const [entertainmentValue, setEntertainmentValue] = useState(200);
    const [resturantValue, setResturantValue] = useState(150);
    const [signupConfirmationRendered, setSignupConfirmationRendered] = useState(false);
    const [signingupRendered, setSigningupRendered] = useState(false);
    const [errorSigningUpRendered, setErrorSigningUpRendered] = useState(false);

    let [loggedIn, setLoggedIn] = useState(false);

    const options = {

    };

    //SET TEXT INSIDE OF GRAPH
    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data } = chart;

            ctx.save();
            ctx.font = 'bold 30px sans-serif';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const total_expenses = parseInt(data.datasets[0].data[0]) +
                parseInt(data.datasets[0].data[1]) +
                parseInt(data.datasets[0].data[2]) +
                parseInt(data.datasets[0].data[3]) +
                parseInt(data.datasets[0].data[4])
            ctx.fillText(total_expenses, chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y);
        }
    }

    const plugins = [
        textCenter
    ]

    const handleChange = (changeFunction) => (event) => {
        changeFunction(event.target.value);
    };

    //ALL PROPS FOR INPUT CONTAINER COMPONENTS
    const vehicleProps = {
        category: "Vehicle",
        value: vehicleValue,
        changeFunction: handleChange(setVehicleValue)
    };
    const rentProps = {
        category: "Rent/Mortgage",
        value: rentValue,
        changeFunction: handleChange(setRentValue)
    };
    const groceryProps = {
        category: "Grocery",
        value: groceryValue,
        changeFunction: handleChange(setGroceryValue)
    };
    const entertainmentProps = {
        category: "Entertainment",
        value: entertainmentValue,
        changeFunction: handleChange(setEntertainmentValue)
    };
    const resturantProps = {
        category: "Resturant",
        value: resturantValue,
        changeFunction: handleChange(setResturantValue)
    };

    //HANDLE UPDATING THE GRAPH WHEN DATA CHANGES
    useEffect(() => {
        const newData = { ...data };
        newData.datasets[0].data[0] = vehicleValue;
        newData.datasets[0].data[1] = rentValue;
        newData.datasets[0].data[2] = groceryValue;
        newData.datasets[0].data[3] = entertainmentValue;
        newData.datasets[0].data[4] = resturantValue;
        setData(newData);
    }, [vehicleValue, rentValue, groceryValue, entertainmentValue, resturantValue]
    );

    const [loginRenderedValue, setLoginRenderedValue] = useState(false);
    const handleLoginRenderedChange = () => {
        setLoginRenderedValue(!loginRenderedValue);
    }

    //EMAIL AND PASS FOR LOGIN/SIGNUP
    const [emailValue, setEmailValue] = useState("");
    const [passValue, setPassValue] = useState("");

    //LOGIN/SIGNUP/SAVED_DATA/DATA_RETREVIAL
    const handleLogin = async () => {

        const response = await fetch('http://localhost:3001/checkCredentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailValue, password: passValue }),
        });

        const data = await response.json();
        console.log(data.message);

        if (data.message == "Credentials are valid") {
            setLoggedIn(true);
            user_id = data.id;
            setLoginRenderedValue(false);
            (async () => {
                const data_response = await fetch('http://localhost:3001/getData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: user_id }),
                });

                const data_values = await data_response.json();
                console.log(data_values.message);
                setVehicleValue(data_values.vehicle)
                setRentValue(data_values.rent)
                setGroceryValue(data_values.grocery)
                setEntertainmentValue(data_values.entertainment)
                setResturantValue(data_values.resturant)
            })();
        }
    };

    const handleSave = async () => {

        const response = await fetch('http://localhost:3001/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vehicle: vehicleValue,
                rent: rentValue,
                grocery: groceryValue,
                entertainment: entertainmentValue,
                resturant: resturantValue,
                id: user_id,
            }),
        });

        const data = await response.json();
        console.log(data.message);

    };

    const handleSignup = async () => {

        setSigningupRendered(true);

        const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailValue,
                password: passValue,
            }),
        });

        const data = await response.json();
        console.log(data.message);

        if (data.message == 'Sign Up Successful') {
            setSigningupRendered(false);
            setSignupConfirmationRendered(true);
            setTimeout(() => {
                setSignupConfirmationRendered(false)
            }, 3000);
        } else {
            setErrorSigningUpRendered(true);
            setTimeout(() => {
                setErrorSigningUpRendered(false)
            }, 3000);
        }

    };

    const handleSignout = () => {
        setLoggedIn(false);
        console.log("Successfully Logged Out")
    };

    //JSX COMPONENT PROPS
    const pieChartContainerProps = {
        data,
        options,
        plugins,
        vehicleProps,
        rentProps,
        groceryProps,
        loggedIn,
        entertainmentProps,
        loginRenderedValue,
        resturantProps,
        handleLoginRenderedChange,
        handleSignout,
        handleSave
    }
    
    const loginSignupContainerProps = {
        signupConfirmationRendered,
        signingupRendered,
        errorSigningUpRendered,
        handleChange,
        emailValue,
        setEmailValue,
        passValue,
        setPassValue,
        handleLogin,
        handleSignup,

    }
    {/* JSX COMPONENTS DEFINED AT TOP OF FILE */ }
    return (
        <>
            <PieChartContainer {...pieChartContainerProps} />
            {loginRenderedValue ?
            <LoginSignupContainer {...loginSignupContainerProps}/>
            : null}
        </>
    );
}

export default ExpensesPieChart;