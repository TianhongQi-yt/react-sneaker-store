import React from 'react';

// 页眉组件
const Header = props => (
    <div className="header">
        <div className="grid">
            <div className="start">
                <a href="/">Home</a>
            </div>
            <div className="end">
                {props.nickname ? (
                    <span className="nickname">
                        <i className="fa fa-user-circle fa-fw fa-lg" aria-hidden="true"></i>
                        {props.nickname}
                    </span>
                ) : (
                    <React.Fragment>
                        <a href="/">Login</a>
                        <a href="/">Register</a>
                    </React.Fragment>
                )}
            </div>
        </div>
    </div>
);

export default Header;