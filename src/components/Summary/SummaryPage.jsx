import './SummaryPage.css'
import user from '../../assets/icon-user.png'

const SummaryPage = () => {
    return(
        <>
            <section className="container">
                <div className="top">
                    <div className="top-left">
                        <img src={user} alt="Logo" className='user-photo'/>
                        <div className="info">
                            <p>Nombre: Doctor Andres Cordoba</p>
                            <p>C.C. 1018239812</p>
                        </div>
                    </div>
                    <div className="top-right">
                        <h1>Resumen de la Sesion</h1>
                        <p>¡Gracias por mantener los más altos estándares de higiene y seguridad en nuestro instituto!</p>
                    </div>
                </div>
                <div className="buttom">
                    <h2>Lavado de Manos finalizado!</h2>
                    <h2>Y recuerda: Tus manos pueden salvar vidas, mantenlas limpias.</h2>
                    <p>Un informe de este proceso se ha guardado en nuestra base de satos!.</p>
                </div>
            </section>
        </>
    );
};

export default SummaryPage;