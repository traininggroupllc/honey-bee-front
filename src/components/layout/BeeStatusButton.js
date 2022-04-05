import React from 'react'
import { Spinner } from 'react-bootstrap'

const BeeStatusButton = (props) => {
    const [text, setText] = React.useState('Working')
    const [seconds, setSeconds] = React.useState(0)

    React.useEffect(async () => {
        setInterval(async () => {
            const diff = await parseInt(new Date().getTime() / 1000 - props.time)
            setSeconds(diff)
            if (diff > 86400) {
                setText('Collect')
            } else {
                setText('Working')
            }
        }, 1000);
    }, []);

    const handleClick = () => {
        if (seconds > 86400) {
            props.handleClicked(props.beeId)
        }
    }

    return (
        <button onClick={handleClick} className={'btn bg-yellow font-weight-bold px-4 ' + (seconds <= 86400 ? 'text-secondary' : null)}>
            {
                props.isCollecting ?
                <>
                <Spinner as='span' animation='border' size='xs' role='status' aria-hidden='true' className='collect-spin'/>&nbsp;
                Collecting
                </>
                :
                <>{text}</>
            }
        </button>
    )
}

export default BeeStatusButton