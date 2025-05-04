import { useAuth } from '../context/AuthContext';

function Home() {
    const { user, logout } = useAuth();

    return (
        <header>
            {user ? (
                <>
                    <span>Hola, {user.username}</span>
                    <button onClick={logout}>Cerrar sesión</button>
                </>
            ) : (
                <a href="/auth">Iniciar sesión</a>
            )}
        </header>
    );
}

export default Home;