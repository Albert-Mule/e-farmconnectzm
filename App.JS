import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    onAuthStateChanged,
    signInWithCustomToken
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    query,
    doc,
    setDoc
} from 'firebase/firestore';

// --- Firebase Configuration ---
// These variables are placeholders and will be automatically populated in the environment.
const firebaseConfig = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config) 
    : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-efarm-app';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Helper: Icon Component for UI ---
const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


// --- Main Application Component ---
export default function App() {
    // --- State Management ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Effect 1: Initialize Firebase & Handle Authentication ---
    // This effect runs once on component mount to set up Firebase and authentication.
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const authInstance = getAuth(app);
            const dbInstance = getFirestore(app);
            
            setAuth(authInstance);
            setDb(dbInstance);

            // Set up an authentication state listener.
            // This will fire when the user signs in or out.
            const unsubscribe = onAuthStateChanged(authInstance, (user) => {
                if (user) {
                    // User is signed in. Set their unique ID.
                    setUserId(user.uid);
                } else {
                    // User is signed out.
                    setUserId(null);
                }
                // Once auth state is determined, we can stop the initial loading indicator.
                setIsLoading(false);
            });
            
            // Sign the user in. Use the provided token if available, otherwise sign in anonymously.
            const signIn = async () => {
                if (initialAuthToken) {
                    await signInWithCustomToken(authInstance, initialAuthToken);
                } else {
                    await signInAnonymously(authInstance);
                }
            };
            
            signIn().catch(err => {
                 console.error("Authentication failed:", err);
                 setError("Could not connect to the service. Please refresh.");
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        } catch(e) {
            console.error("Firebase initialization error:", e);
            setError("Failed to initialize the application. Please check the configuration.");
            setIsLoading(false);
        }
    }, []);

    // --- Effect 2: Subscribe to Real-time Product Updates ---
    // This effect listens for changes in the Firestore 'products' collection.
    // It runs only when `db` or `userId` state changes.
    useEffect(() => {
        // **FIX**: Only attempt to fetch data if we have a database connection AND a signed-in user.
        // This prevents the "Missing or insufficient permissions" error.
        if (!db || !userId) {
            // If there's no user, clear existing products and stop.
            setProducts([]);
            return;
        }

        const productsCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
        
        setIsLoading(true);
        setError(null);

        // Create a query to fetch all documents in the collection.
        const q = query(productsCollectionRef);

        // onSnapshot listens for real-time updates.
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData = [];
            querySnapshot.forEach((doc) => {
                // Push product data along with its unique ID.
                productsData.push({ id: doc.id, ...doc.data() });
            });
            setProducts(productsData);
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching products:", err);
            setError("Failed to load products from the database.");
            setIsLoading(false);
        });

        // Cleanup: Unsubscribe from the listener when the component unmounts or dependencies change.
        return () => unsubscribe();
    }, [db, userId, appId]); // Rerun this effect if db, userId, or appId changes.

    // --- Event Handler: Update form state on input change ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    // --- Event Handler: Submit new product to Firestore ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // **FIX**: Ensure we have a DB connection and user before submitting.
        const productsCollectionRef = db ? collection(db, 'artifacts', appId, 'public', 'data', 'products') : null;

        if (!newProduct.name || !newProduct.price || !productsCollectionRef || !userId) {
            alert('Please fill in at least the product name and price.');
            return;
        }
        
        setIsSubmitting(true);
        setError(null);

        try {
            // Add a new document to the 'products' collection.
            await addDoc(productsCollectionRef, {
                ...newProduct,
                price: parseFloat(newProduct.price) || 0, // Ensure price is a number
                quantity: parseInt(newProduct.quantity, 10) || 0, // Ensure quantity is an integer
                addedBy: userId, // Tag the product with the user who added it
                createdAt: new Date().toISOString() // Add a timestamp
            });

            // Reset the form for the next entry.
            setNewProduct({ name: '', description: '', price: '', quantity: '' });
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Could not save the new product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- Render UI ---
    return (
        <div className="bg-green-50 min-h-screen font-sans text-gray-800">
            <header className="bg-white shadow-md p-4 sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-green-700">
                        <LeafIcon />
                        E-FarmConnect
                    </h1>
                    <div className="text-right">
                        <span className="text-xs text-gray-500 block">Your User ID</span>
                        <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">{userId || 'Connecting...'}</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Column 1: Add Product Form */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Add New Produce</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input type="text" name="name" id="name" value={newProduct.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" id="description" value={newProduct.description} onChange={handleInputChange} rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
                            </div>
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (per unit)</label>
                                <input type="number" name="price" id="price" step="0.01" value={newProduct.price} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
                            </div>
                             <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Available Quantity</label>
                                <input type="number" name="quantity" id="quantity" value={newProduct.quantity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <button type="submit" disabled={isSubmitting || !userId} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
                                {isSubmitting ? 'Adding...' : 'Add Product'}
                            </button>
                            {!userId && <p className="text-xs text-center text-yellow-600 mt-2">Connecting to database...</p>}
                        </form>
                    </div>

                    {/* Column 2: Product List */}
                    <div className="lg:col-span-2">
                         <h2 className="text-2xl font-semibold mb-4">Available Produce</h2>
                         {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4">{error}</div>}
                         {isLoading ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Loading fresh produce...</p>
                            </div>
                         ) : products.length === 0 ? (
                            <div className="text-center bg-white p-10 rounded-xl shadow-md border border-gray-200">
                                <p className="text-gray-500">{userId ? 'No products have been listed yet. Be the first!' : 'Please wait, connecting to the service...'}</p>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {products.map(product => (
                                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                        <div className="p-5 flex-grow">
                                            <h3 className="text-xl font-bold text-green-800">{product.name}</h3>
                                            <p className="text-gray-600 mt-2">{product.description}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 border-t border-green-100 flex justify-between items-center">
                                            <p className="text-lg font-semibold text-green-700">${(product.price || 0).toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         )}
                    </div>
                </div>
            </main>
        </div>
    );
}
