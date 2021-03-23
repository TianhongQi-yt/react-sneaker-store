import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from 'pages/App';
import Login from 'pages/Login';
import NotFound from 'pages/NotFound';
import Cart from 'pages/Cart';

const Router = () => {
    return (
    <BrowserRouter>
        <Switch>
            {/* exact访问根路径精确匹配，避免匹配其他 */}
            <Route path="/" exact component={ App } />
            <Route path="/login" component={ Login } />
            <Route path="/cart" component={ Cart } />
            <Route component={ NotFound } />
        </Switch>
    </BrowserRouter>
)}

export default Router;