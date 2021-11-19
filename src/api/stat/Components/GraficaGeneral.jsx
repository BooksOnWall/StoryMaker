import React, { Component } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { ResponsiveContainer } from 'recharts/lib/component/ResponsiveContainer';
import { Segment } from 'semantic-ui-react';

const GraficaGeneral = () => {
    return (
        <Segment inverted style={{ height: '30vh' }}>
            <ResponsiveContainer>
                <Line
                    data={{
                        labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fry', 'Sat', 'Sun'],
                        datasets: [
                            {
                                data: [100, 120, 400, 200, 130, 300, 400],
                                borderColor: [
                                    '#f16623'
                                ],
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                display: false,
                            }
                        },
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
                    }
                    }
                />
            </ResponsiveContainer>

        </Segment>
    )
}

export default GraficaGeneral;