import { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner';

export default function PersistGate({ children }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 200);
        return () => clearTimeout(timer);
    }, []);

    if (!isReady) {
        return <Spinner />;
    }

    return children;
}
