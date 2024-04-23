import {useEffect, useState} from 'react';

export function WeatherGraph() {
    const weatherImageUrl = 'https://servlet.dmi.dk/byvejr/servlet/byvejr_dag1?by=5000&mode=long&eps=true';
    const [imageHash, setImageHash] = useState(0);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        updateWeatherImage();

        function getMillisecondsToNextHour() {
            const now = new Date();
            const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 5, 0, 0);

            return nextHour.getTime() - now.getTime();
        }

        function updateWeatherImage() {
            const hash = Math.floor(new Date().getTime() / 1000);
            setImageHash(hash);

            timeout = setTimeout(updateWeatherImage, getMillisecondsToNextHour());
        }

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    return (
        <img src={`${weatherImageUrl}&t=${imageHash}`} alt={'Weather Graph'} />
    );
}