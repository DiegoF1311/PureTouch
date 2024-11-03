import './LandingPage.css';
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/verify');
    };

    return (
        <>
            <section className='container-landing'>
                <div className='top-landing'>
                    <div className='left-landing'>
                        <img src={logo} alt="Logo" />
                    </div>
                    <div className='right-landing'>
                        <h1>Instituto Nacional de Cancerología Unidad de Cuidados Intensivos</h1>
                    </div>
                </div>
                <div className='buttom-landing'>
                    <h1>Bienvenido a <br/> PureTouch</h1>
                    <form className='form' onSubmit={handleSubmit}>
                        <input type="number" placeholder="Ingrese su documento de identidad" className="input-field" />
                        <button type='submit' className="submit-button">Ingresar</button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default LandingPage;