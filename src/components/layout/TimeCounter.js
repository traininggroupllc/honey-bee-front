import React from 'react'
import secondsToHms from './../../utils/secondsToHms'

const TimeCounter = (props) => {
    const [seconds, setSeconds] = React.useState(0)

    React.useEffect(async () => {
        setInterval(async () => {
            const diff = await parseInt(new Date().getTime() / 1000 - props.time)
            setSeconds(diff)
        }, 1000);
    }, []);

    return (
        <>{secondsToHms(seconds)}</>
    )
}

export default TimeCounter