import React from 'react';
import {Link} from 'react-router-dom';


import './Home.css';

export default () => (
    <React.Fragment>
        <section className="hero is-primary is-large has-bg-img">
            <div className="hero-body">
                <div className="container home-title">
                    <h1 className="title">
                        Recipe Sync - File Not Found
                    </h1>                    
                    <div>
                        <p>
                            Sorry, we cannot find what you were looking for.
                        </p>
                        
                        <Link className="is-size-5" to="/">Return Home</Link>
                    </div>
                </div>
            </div>
        </section>
    </React.Fragment>
)