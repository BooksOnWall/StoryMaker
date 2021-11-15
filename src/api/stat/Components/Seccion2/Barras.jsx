import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ResponsiveContainer } from 'recharts/lib/component/ResponsiveContainer';
import { Segment } from 'semantic-ui-react';

const Barras = () => {
    return (
        <secction>
            <secction>
                <Segment inverted style={{fontWeight: 'bold'}}>
                    INSTALL VS COMPLETE
                </Segment>
                <Segment inverted className='headerInstall'>
                    <Segment inverted className='install'>Install <a className='circulo'></a></Segment>
                    <Segment inverted className='completed'>Completed <a className='circuloDos'></a></Segment>
                </Segment>
            </secction>
            <Segment inverted>
                <ResponsiveContainer width='100%' height='100%'>
                    <Bar
                        data={{
                            labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fry', 'Sat', 'Sun'],
                            datasets: [
                                {
                                    data: [100, 120, 400, 200, 130, 300, 400],
                                    backgroundColor: [
                                        '#f16623',
                                        '#ff5300',

                                    ],
                                },
                            ],
                        }}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            Responsive: true,
                                            beginAtZero: true,
                                        },
                                    },
                                ],
                            },
                            layout: {
                                padding: 0,
                            },
                            legend: {
                                options:{
                                    legend: {
                                        display: false
                                    }
                                },
                                labels: {
                                    fontSize: 25,
                                },
                            },
                        }
                        }
                    />
                </ResponsiveContainer>

            </Segment>
        </secction>

    )
}

export default Barras;
