import { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import './HeaderUser.css';
import { useNavigate } from 'react-router-dom';
import user from '../../assets/icon-user.png';

const PostureDetection = () => {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const [isVerified, setIsVerified] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleVerification = (status) => {
        setIsVerified(status);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
    };

    const videoRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    var [predictionText, setPredictionText] = useState("Postura: Cargando...");
    var [isPredicting, setIsPredicting] = useState(false);
    const [model1, setModel1] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadModel1 = async () => {
            const loadedModel1 = await tf.loadLayersModel('/model1/model.json');
            setModel1(loadedModel1);
            console.log("Modelo 1 cargado");
        };
        loadModel1();
    }, []);

    useEffect(() => {
        if (model1 && !isPredicting) {
            startPrediction();
        }
    }, [model1]);

    const setupCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        videoRef.current.srcObject = stream;
        await new Promise(resolve => (videoRef.current.onloadedmetadata = resolve));
    };

    const startPrediction = async () => {
        if (!isPredicting) {
            await setupCamera();
            isPredicting = true;
        }
        while (isPredicting) {
            console.log("Predicting?")
            const img = tf.browser.fromPixels(videoRef.current);
            const resized = tf.image.resizeBilinear(img, [224, 224]);
            const normalized = resized.div(255);
            const batched = normalized.expandDims(0);

            const prediction = model1.predict(batched);
            const predictionArray = await prediction.array();

            const resultado = predictionArray[0][0] > predictionArray[0][1] ? "Pasa" : "No Pasa";
            console.log("Datos recibidos del modelo:", predictionArray);
            setPredictionText(`Resultado: ${resultado}`);

            if (resultado === "Pasa") {
                handleVerification(true);
                await sleep(1500)
                stopPrediction();
                navigate("/process");
                break;
            }

            img.dispose();
            resized.dispose();
            normalized.dispose();
            batched.dispose();
            prediction.dispose();

            await tf.nextFrame();
        }
    };

    const stopPrediction = () => {
        setIsPredicting(false);
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setPredictionText("Lectura detenida.");
    };

    return (
        <div className="container-verify">
            <div className="top-verify">
                <div className="left-verify">
                    <img src={user} alt="Logo" className='user-photo'/>
                    <div className="info">
                        <p>Nombre: Doctor Andres Cordoba</p>
                        <p>C.C. 1018239812</p>
                    </div>
                </div>
                <div className="right-verify">
                    <br/>
                    <p>¡Verificando tus Manos!</p>
                </div>
            </div>

            <div className="bottom-verify">
                <video ref={videoRef} autoPlay muted width="640" height="480"></video>
            </div>

            {showPopup && (
                <div className={`popup ${isVerified ? 'correct' : 'incorrect'}`}>
                    {isVerified ? 'Verificación Correcta' : 'Verificación Incorrecta'}
                </div>
            )}
        </div>
    );
};

export default PostureDetection;
