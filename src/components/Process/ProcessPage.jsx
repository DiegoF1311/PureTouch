import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import './ProcessPage.css';
import user from '../../assets/icon-user.png';
import s1 from '../../assets/step1.png';
import s2 from '../../assets/step2.png';
import s3 from '../../assets/step3.png';
import s4 from '../../assets/step4.png';
import s5 from '../../assets/step5.png';
import s6 from '../../assets/step6.png';

const ProcessPage = () => {
    const navigate = useNavigate();
    const imagenes = [s1, s2, s3, s4, s5, s6];
    const videoRef = useRef(null);
    const [predictionText, setPredictionText] = useState("Postura: Cargando...");
    var [isPredicting, setIsPredicting] = useState(false);
    const [model2, setModel2] = useState(null);
    const posturas = ["Postura 1", "Postura 2", "Postura 3", "Postura 4", "Postura 5", "Postura 6", "Postura 7"];
    const posturasMostrar = ["Postura 1", "Postura 2", "Postura 3", "Postura 4", "Postura 5", "Postura 6"];
    const [postureCounts, setPostureCounts] = useState(Array(posturas.length).fill(0)); // Array para contar las posturas
    const [totalDetections, setTotalDetections] = useState(0); // Contador total de detecciones
    const [totalTime, setTotalTime] = useState(0); // Contador de tiempo total en segundos
    const [stepTimes, setStepTimes] = useState(Array(posturas.length).fill(0)); // Tiempo asignado a cada postura
    const timerRef = useRef(null); // Ref para almacenar el ID del temporizador
    var cont = true;

    const goToResultPage = () => {
        navigate('/summary', { state: { totalTime, stepTimes } });
    };

    // Cargar model2 al montar el componente
    useEffect(() => {
        const loadModel2 = async () => {
            try {
                const loadedModel2 = await tf.loadLayersModel('/model2/model.json');
                setModel2(loadedModel2);
                console.log("Modelo 2 cargado");
            } catch (error) {
                console.error("Error al cargar el modelo:", error);
            }
        };
        loadModel2();
    }, []);

    // Iniciar predicción automáticamente cuando model2 se haya cargado
    useEffect(() => {
        if (model2 && !isPredicting) {
            console.log("Iniciando predicción con modelo 2...");
            startPrediction();
        }
    }, [model2]);

    // Iniciar la cámara
    const setupCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            videoRef.current.srcObject = stream;
            await new Promise(resolve => (videoRef.current.onloadedmetadata = resolve));
            console.log("Cámara configurada correctamente");
        } catch (error) {
            console.error("Error al configurar la cámara:", error);
        }
    };

    // Función para manejar la predicción
    const startPrediction = async () => {
        if (!isPredicting) {
            await setupCamera();
            isPredicting = true;
        }

        // Iniciar el temporizador
        timerRef.current = setInterval(() => {
            setTotalTime(prevTime => prevTime + 1);
        }, 1000);

        console.log("Entrando en el ciclo de predicción con modelo 2...");

        while (isPredicting && cont) {
            const img = tf.browser.fromPixels(videoRef.current);
            const resized = tf.image.resizeBilinear(img, [224, 224]);
            const normalized = resized.div(255);
            const batched = normalized.expandDims(0);

            const prediction = model2.predict(batched);
            const predictionArray = await prediction.array();

            // Proceso de predicción con el modelo 2
            const maxIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
            const detectedPosture = posturas[maxIndex];
            setPredictionText(`Postura detectada: ${detectedPosture}`);
            console.log("Predicción actual:", detectedPosture);

            // Actualizar métricas de postura
            setPostureCounts(prevCounts => {
                const newCounts = [...prevCounts];
                newCounts[maxIndex] += 1;
                if(newCounts[6] >= 3){
                    stopPrediction();
                }
                return newCounts;
            });
            setTotalDetections(prevTotal => prevTotal + 1);

            // Liberar memoria de los tensores
            img.dispose();
            resized.dispose();
            normalized.dispose();
            batched.dispose();
            prediction.dispose();

            await tf.nextFrame();
        }
    };

    // Detener la predicción, el temporizador y mantener los últimos valores
    const stopPrediction = () => {
        setIsPredicting(false);
        cont = false;
        // Apagar la cámara
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        
        // Detener el temporizador
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Mantener el texto de predicción en su último valor
        setPredictionText((prevText) => prevText);
        goToResultPage();
    };

    // Calcular porcentajes de cada postura detectada
    const calculatePercentages = () => {
        return postureCounts.map(count => ((count / totalDetections) * 100).toFixed(2));
    };

    // Calcular el tiempo asignado a cada postura
    useEffect(() => {
        const percentages = calculatePercentages();
        const newStepTimes = percentages.map(percentage => Math.floor((percentage / 100) * totalTime));
        setStepTimes(newStepTimes);
    }, [postureCounts, totalTime]);

    return (
        <section className="container-process">
            <div className="top-process">
                <div className="top-left-process">
                    <img src={user} alt="Logo" className='user-photo'/>
                    <div className="info">
                        <p>Nombre: Doctor Andres Cordoba</p>
                        <p>C.C. 1018239812</p>
                    </div>
                </div>
                <div className="top-right">
                    <h1>La prevención empieza <br/> en tus manos!</h1>
                </div>
            </div>
            <div className="buttom-process">
                <div className="buttom-left-process">
                    <div className="cam-container">
                        <video ref={videoRef} autoPlay muted width="340" height="220"></video>
                        <div>{predictionText}</div>
                    </div>
                    <div className="timer">
                        <p>Tiempo total: {`${Math.floor(totalTime / 60).toString().padStart(2, '0')}:${(totalTime % 60).toString().padStart(2, '0')}`}</p>
                    </div>
                </div>
                <div className="buttom-right-process">
                    {posturasMostrar.map((postura, index) => (
                        <div className="step" key={index}>
                            <h3>Paso {index + 1}</h3>
                            <img src={imagenes[index]} alt={`Imagen de ${postura}`} className='step-photo' />
                            <div className="timer-step">
                                <p>{`${Math.floor(stepTimes[index] / 60).toString().padStart(2, '0')}:${(stepTimes[index] % 60).toString().padStart(2, '0')}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessPage;