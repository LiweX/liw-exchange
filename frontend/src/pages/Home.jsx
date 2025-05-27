import { useAuth } from '../context/AuthContext';

function Home() {
    const { user, logout } = useAuth();

    return (
        <div className='flex flex-col items-center justify-center'>
            {user ? (
                <>
                    <span>Hola, {user.username}</span>
                    <button onClick={logout}>Cerrar sesión</button>
                </>
            ) : (
                <a href="/auth">Iniciar sesión</a>
            )}
        </div>
    );
}

export default Home;