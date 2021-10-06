import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//import Products from './components/Products/Products';
//import Navbar from './components/NavBar/Navbar';

import {Products, Navbar, Cart, Checkout} from './components';

const App = () => {
    const [ products, setProducts ] = useState([]);
    const [ cart, setCart ] = useState({});
    const [ order, setOrder ] = useState({});
    const [ errorMsg, setErrorMsg ] = useState('');

    const fetchProducts = async () => {
        try {
            const res = await commerce.products.list();
            setProducts(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCart = async () => {
        try{
            const items = await commerce.cart.retrieve()
            setCart(items)
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddToCart = async (productId, quanitity) => {
        const item = await commerce.cart.add(productId, quanitity);

        setCart(item.cart);
    };

    const onUpdateCartQty = async (productId, quantity) => {
        const res = await commerce.cart.update(productId, {quantity});
        setCart(res.cart);
    };

    const onRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);
        setCart(cart);
    };

    const handleEmptyCart = async () => {
        const { cart }  = await commerce.cart.empty();
        setCart(cart);
    };

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            setOrder(incomingOrder);
            refreshCart()
        } catch (er) {
            setErrorMsg(er.data.error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();  
    },[]);


    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path='/'>
                        <Products products={products} onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path='/cart'>
                        <Cart 
                        cart={cart}
                        onUpdateCartQty={onUpdateCartQty}
                        onRemoveFromCart={onRemoveFromCart}
                        onEmptyCart={handleEmptyCart}
                        />    
                    </Route>
                    <Route exact path='/checkout'>
                        <Checkout 
                        order={order}
                        onCaptureCheckout={handleCaptureCheckout}
                        error={errorMsg}
                        cart={cart} />
                    </Route>
                </Switch>
            </div>
        </Router>
        
    )
}

export default App;
