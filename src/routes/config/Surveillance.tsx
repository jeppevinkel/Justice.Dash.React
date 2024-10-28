import {useEffect, useState} from 'react';

interface ISurveillance {
    mdm: {type: string, week: number, responsible: string}[];
    edi: {type: string, week: number, responsible: string}[];
}

function Surveillance() {
    const [surveillance, setSurveillance] = useState<ISurveillance>({mdm: [], edi: []});

    useEffect(() => {
        fetch('/api/surveillance')
            .then((res) => res.json())
            .then((data) => setSurveillance({mdm: data.mdm, edi: data.edi}));
    }, []);

    return (
        <div>
            {surveillance.mdm.map(it => (
                <>
                    <div className="field-row-stacked" style={{width: '200px'}}>
                        <label htmlFor="text27">Uge {it.week}, Asnvarlig</label>
                        <input id="text27" type="text" defaultValue={it.responsible}/>
                    </div>
                </>
            ))}
        </div>
    );
}

export default Surveillance;