import { useState, useEffect } from "react"
import { Footer } from "./components/Footer"
import { Guitarra } from "./components/Guitarra"
import { Header } from "./components/Header"
import { db } from "./data/db"



export const App = () => {

    function initialCart() {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data, setData] = useState(db);
    const [cart, setCart] = useState(initialCart);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(guitarra) {
        const itemIndex = cart.findIndex((item) => guitarra.id === item.id)

        console.log(itemIndex)

        if (itemIndex === -1) {
            guitarra.quantity = 1;
            setCart([...cart, guitarra])
        }
        else {
            const updateCart = [...cart] //copia de cart
            updateCart[itemIndex].quantity++;
            setCart(updateCart);
        }

    }

    function calculateTotal() {
        let total = cart.reduce((total, item) => total + item.price * item.quantity, 0)
        return total;
    }
    function increaseQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCart(updateCart);
    }
    function decreaseQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        }).filter(item => item.quantity > 0);
        setCart(updateCart);
    }
    function clearCart() {
        setCart([]);
    }

    function removeFromCart(id) {
        setCart(cart.filter(item => item.id !== id));
    }

    return (
        <>
            <Header 
                cart={cart} total={calculateTotal()} 
                removeFromCart={removeFromCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                clearCart={clearCart} />
                
            <main className="container-xl mt-5">
                <h2 className="text-center">Nuestra Colección</h2>

                <div className="row mt-5">
                    {data.map((guitarra) => (
                        <Guitarra guitarra={guitarra} key={guitarra.id} addToCart={addToCart} />
                    ))}

                </div>
            </main>
            <Footer />

        </>
    )
}
