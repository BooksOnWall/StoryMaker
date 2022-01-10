import React, { Component } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

import { ResponsiveContainer } from 'recharts/lib/component/ResponsiveContainer';
import { Segment } from 'semantic-ui-react';

const GrafDevice = ({ title }) => {
    return (
        <Segment inverted className='graficaDona'>
            <ResponsiveContainer>
                <Doughnut
                    data={{
                        labels: ['1', '2', '3', '4'],
                        datasets: [
                            {
                                label: 'dona',
                                data: [100, 120, 400, 200, 130, 300, 400],
                                backgroundColor: [
                                    '#E02401',
                                    '#FF9300',
                                    '#D44000',
                                    '#F0A500'
                                ],
                                borderColor: [
                                    'transparent'
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
                        legend: {
                            labels: {
                                fontSize: 25,
                            },
                        },
                    }
                    }

                />
            </ResponsiveContainer>

        </Segment>
    )
}

export default GrafDevice;