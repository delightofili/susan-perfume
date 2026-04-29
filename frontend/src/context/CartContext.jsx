import supabase from "../api/supabaseClient";
import { createContext, useEffect, useReducer } from "react";

const CartContext = createContext();
export default CartContext;

// ✅ Helper: Guest Cart ID
const getOrCreateCartId = () => {
  let cartId = localStorage.getItem("cart_id");

  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem("cart_id", cartId);
    console.log("🆕 New cart:", cartId);
  }

  return cartId;
};

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload, loading: false };

    case "ADD_ITEM":
      return { ...state, cart: [...state.cart, action.payload] };

    case "REMOVE_ITEM":
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
      };

    case "UPDATE_QTY":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [], loading: false, error: null };

    case "SET_LOADING":
      return { ...state, loading: true };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ FETCH CART
  const fetchCart = async () => {
    try {
      dispatch({ type: "SET_LOADING" });

      const cartId = getOrCreateCartId();

      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("cart_id", cartId);

      if (error) throw error;

      dispatch({ type: "SET_CART", payload: data || [] });
    } catch (err) {
      console.error("FETCH CART ERROR:", err);
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  // ✅ ADD ITEM
  const addItem = async (product) => {
    try {
      const cartId = getOrCreateCartId();
      const productId = String(product.id);

      const price = Number(product.price) || 0;

      // check existing
      const { data: existing } = await supabase
        .from("cart")
        .select("*")
        .eq("product_id", productId)
        .eq("cart_id", cartId)
        .maybeSingle();

      if (existing) {
        return updateQuantity(existing.id, existing.quantity + 1);
      }

      const { data, error } = await supabase
        .from("cart")
        .insert([
          {
            cart_id: cartId,
            product_id: productId,
            name: product.name,
            price,
            image: product.image,
            quantity: 1,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "ADD_ITEM", payload: data });
    } catch (err) {
      console.error("ADD ITEM ERROR:", err);
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  // ✅ REMOVE
  const removeItem = async (id) => {
    try {
      const { error } = await supabase.from("cart").delete().eq("id", id);
      if (error) throw error;

      dispatch({ type: "REMOVE_ITEM", payload: id });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ UPDATE
  const updateQuantity = async (id, quantity) => {
    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", id);

      if (error) throw error;

      dispatch({
        type: "UPDATE_QTY",
        payload: { id, quantity },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      const cartId = getOrCreateCartId();
      //delete from supabase
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("cart_id", cartId);

      if (error) throw error;
      //reset local state
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      console.error("CLEAR CART ERROR:", err);
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  const totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        loading: state.loading,
        error: state.error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
