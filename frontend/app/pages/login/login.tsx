import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
export function Login() { 
    const [number, setNumber] = useState(0);

    useEffect(() => {
        fetch("")
    }) 

    return (
        <div className="container">
            <div className="row">
                <div className="offset-3 col-6">
                    <div className="card">
                        <h3 className="card-header bg-primary text-white">
                            Counter
                        </h3>
                        <div className="card-body">
                            <button className="btn btn-primary me-3" onClick={() => {setNumber(number-1)}}>-</button>
                            <span>{number}</span>
                            <button className="btn btn-primary ms-3" onClick={() => {setNumber(number+1)}}>+</button>
                            <div className="row">
                                <div className="col-12 mt-4">
                                    <button className="btn btn-danger" onClick={() => {setNumber(0)}}>Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}